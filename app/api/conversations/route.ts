import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invaild data", { status: 400 });
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, "conversation:new", newConversation);
        }
      });

      return NextResponse.json(newConversation);
    }

    // const exisitingConversations = await prisma.conversation.findMany({
    //     where: {
    //         OR: [
    //             {
    //                 userIds: {
    //                     equals: [currentUser.id, userId]
    //                 }
    //             },
    //             {
    //                 userIds: {
    //                     equals: [userId, currentUser.id]
    //                 }
    //             }
    //         ]
    //     }
    // });

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        userIds: {
          hasEvery: [currentUser.id, userId],
        },
      },
      include: {
        users: true,
      },
    });

    // const singleConversation = existingConversation[0];

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    newConversation.users.map((user) => {
      if(user.email){
        pusherServer.trigger(user.email, 'conversation:new', newConversation);
      }
    })

    return NextResponse.json(newConversation);
  } catch (error) {
    console.log("CREATE_CONVERSATION_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
