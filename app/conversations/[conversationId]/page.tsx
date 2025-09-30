import getConversationById from "@/app/actions/getConversationById"
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form"
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const ConversationId = async ({params}: {params: Promise<{conversationId: string}>}) => {
    const paramsId = (await params).conversationId;
    const conversation = await getConversationById(paramsId);
    const messages = await getMessages(paramsId);

    const session = await auth();
      const user = session?.user;
      if(!user){
        redirect('/')
      }

    if(!conversation){
        return (
            <div 
            className="lg:pl-80 h-full" >
                <div className="h-full flex flex-col">
                    <EmptyState />
                </div>
            </div>
        )
    }

  return (
    <div className="lg:pl-80 h-full" >
        <div className="h-full flex flex-col">
            <Header conversation={conversation} />
            <Body inititalMessages={messages} />
            <Form />
        </div>
    </div>
  )
}

export default ConversationId
