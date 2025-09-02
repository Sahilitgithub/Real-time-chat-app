import getCurrentUser from "@/app/actions/getCurrentUser"
import prisma from "@/app/lib/prismadb"
import { pusherServer } from "@/app/lib/pusher";
import { NextResponse } from "next/server"

export const POST = async (request: Request, {params}: {params: Promise<{conversationId: string}>}) => {
  try {
    const {conversationId} = await params;
    const currentUser = await getCurrentUser();

    if(!currentUser?.id || !currentUser?.email){
        return new NextResponse("Unathorized", {status: 401})
    }

    // Find the existing conversation
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
        return new NextResponse("Invalid ID", {status: 400})
    }

    // Find the last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if(!lastMessage){
        return NextResponse.json(conversation);
    }

    // Update the last message to mark it as seen
    const updateMessage = await prisma.message.update({
        where: {
            id: lastMessage.id
        },
        include: {
            sender: true,
            seen: true,
        },
        data: {
            seen: {
                connect: {
                    id: currentUser.id
                }
            }
        }
    })

    await pusherServer.trigger(conversationId, 'conversation:update', {
        id: conversationId,
        messages: [updateMessage]
    });

    if(lastMessage.seenIds.indexOf(currentUser.id) !== -1){
        return NextResponse.json(conversation);
    }

    await pusherServer.trigger(conversationId, 'message:update', updateMessage)

    return NextResponse.json(updateMessage);

  } catch (error) {
    console.log("ERROR_MESSAGE_SEEN", error)
    return new NextResponse("Internal Server Error", {status: 500})
  }
}
