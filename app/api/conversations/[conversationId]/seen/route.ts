import { NextResponse } from "next/server";
import { prisma } from "@/app/libs/prismadb"
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

export const POST = async (request: Request, {params}: {params: Promise<{conversationId: string}>}) => {
    try {
        const currentUser = await getCurrentUser();
        const { conversationId } = await params;

        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse("Unauthorized", {status: 401});
        };

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                },
                users: true
            }
        });

        if(!conversation){
            return new NextResponse("Invalid Id", {status: 400})
        }

        // Find the last message
        const lastMessage = conversation.messages[conversation.messages.length - 1];

        if(!lastMessage){
            return NextResponse.json(null);
        }

        // Update seen of last message
        const updateMessage = await prisma.message.update({
            where: {
                id: lastMessage.id
            },
            include: {
                sender: true,
                seen: true
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        });

        await pusherServer.trigger(currentUser.id, 'conversation:update', {
            id: conversationId,
            messages: [updateMessage]
        });

        if(lastMessage.seenIds.indexOf(currentUser.id) !== -1){
            return NextResponse.json(conversation)
        }

        await pusherServer.trigger(conversationId, 'message:update', updateMessage)

        return NextResponse.json(updateMessage)
    } catch (error) {
        console.log("SEEN_MESSAGE_ERROR", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}


