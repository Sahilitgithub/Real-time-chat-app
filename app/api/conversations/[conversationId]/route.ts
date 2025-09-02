import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prismadb";
import { pusherServer } from "@/app/lib/pusher";

interface IParams {
   params: Promise<{ conversationId?: string }>
}

export const DELETE = async (request: Request, {params}: IParams) => {
    try {
        const { conversationId } = await params;
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                users: true
            }
        });

        if(!existingConversation){
            return new NextResponse("Invalid ID", { status: 400 });
        }

        const deleteConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        })

        existingConversation.users.forEach((user) => {
            if(user.email){
                pusherServer.trigger(user.email, 'conversation:remove', existingConversation)
            }
        })

        return NextResponse.json(deleteConversation)

    } catch (error) {
        console.log("Error Conversation Delete", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}