import React from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import ConversationList from './components/ConversationList'
import getConversations from '../actions/getConversations'
import getUsersData from '../actions/getUsers'

const ConversationLayout = async ({children}: {children: React.ReactNode}) => {
  const conversations = await getConversations();
  const users = await getUsersData();
  return (
    <Sidebar>
        <ConversationList 
        users={users}
        initialItems={conversations}
         />
      <div className="h-full">
        {children}
      </div>
    </Sidebar>
  )
}

export default ConversationLayout
