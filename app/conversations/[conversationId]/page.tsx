import { getMessages } from '@/app/actions/getMessages'
import EmptyState from '@/app/components/EmptyState'
import { getConversationById } from '@/app/hooks/getConversationById'
import ConversationHeader from './components/ConversationHeader'
import ConversationBody from './components/ConversationBody'
import Form from './components/Form'


const ConversationId = async ({params}: {params: Promise<{conversationId: string}>}) => {
    const {conversationId} = await params;
    const conversation = await getConversationById(conversationId)
    const messages = await getMessages(conversationId);

    if(!conversation) {
        return (
            <div className='lg:pl-80 h-full'>
                <div className="h-full flex flex-col">
                    <EmptyState />
                </div>
            </div>
        )
    }
  
  return (
    <div className='lg:pl-80 h-full'>
        <div className='h-full flex flex-col'>
            <ConversationHeader conversation={{ ...conversation, messages: messages ?? [] }} />
            <ConversationBody initialMessages={messages ?? []} />
            <Form />
        </div>
    </div>
  )
}

export default ConversationId
