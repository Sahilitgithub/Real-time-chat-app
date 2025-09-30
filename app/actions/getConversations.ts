import { prisma } from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getConversations = async () => {

    const currentUser = await getCurrentUser();

    if(!currentUser?.id){
        return [];
    }

    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: "desc"
            },
            where: {
                userIds: {
                    has: currentUser.id
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        sender: true,
                        seen: true
                    }
                }
            }
            
        })

        return conversations;
    } catch(error) {
        console.log("GET_CONVERSATIONS_ERROR", error)
        return []
    }
  
}

export default getConversations
