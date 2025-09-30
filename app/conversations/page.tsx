import { auth } from "@/auth"
import ProtectedPage from "./protectedPage"
import { redirect } from "next/navigation";


const ConversationHome = async () => {
  const session = await auth();
  if(!session?.user){
    redirect('/')
  }
  return <ProtectedPage />
}

export default ConversationHome
