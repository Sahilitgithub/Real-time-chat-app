import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export const DELETE = async (
  reqeust: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) => {
  try {
    const { conversationId } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const exisitingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!exisitingConversation) {
      return new NextResponse("Invaild Id", { status: 404 });
    }

    const deleteConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
            hasSome: [currentUser.id]
        }
      },
    });

    exisitingConversation.users.forEach((user) => {
       if(user.email){
          pusherServer.trigger(user.email, 'conversation:remove', exisitingConversation)
       }
    })

    return NextResponse.json(deleteConversation);
  } catch (error) {
    console.log("DELETE_CONVERSATION_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
