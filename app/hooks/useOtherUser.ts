import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
export type { User } from "@prisma/client";
import { FullConversationType } from "@/app/types";

export const useOtherUser = (conversation: FullConversationType) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;
    const otherUser = conversation.users.filter((user: User) => user.email !== currentUserEmail);
    return otherUser[0];
  }, [conversation, session?.data?.user?.email]);

  return otherUser;

}