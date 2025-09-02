"use client";

import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { pusherClient } from "@/app/lib/pusher";
import { find } from "lodash";

interface InitialBodyMessagesProps{
  initialMessages: FullMessageType[];
}

const ConversationBody: React.FC<InitialBodyMessagesProps> = ({
  initialMessages
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId])

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if(find(current, {id: message.id})){
          return current;
        }

          return [...current, message];
        })

        bottomRef?.current?.scrollIntoView();
    }

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if(currentMessage.id === newMessage.id){
          return newMessage;
        };

        return currentMessage
      }))
    }

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler)

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler)
    }
  }, [conversationId])

  return (
    <div className='flex overflow-y-auto h-full'>
      {messages.map((message, i) => (
        <MessageBox
          isLastMessage={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  )
}

export default ConversationBody
