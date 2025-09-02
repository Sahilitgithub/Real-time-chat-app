import getCurrentUser from "../actions/getCurrentUser";
import prisma from "../lib/prismadb";

export const getConversationById = async (conversationId: string) => {
    try {
        const currentUser = await getCurrentUser();
        if(!currentUser?.email){
            return null
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });

        return conversation;

    } catch {
        return null
    }
}