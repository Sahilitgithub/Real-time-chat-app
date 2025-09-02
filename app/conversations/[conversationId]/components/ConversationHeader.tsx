"use client";
import Avatar from "@/app/components/Avatar";
import { useOtherUser } from "@/app/hooks/useOtherUser";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";

import { FullConversationType } from "@/app/types";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";

interface ConversationHeaderProps {
  conversation: FullConversationType;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
}) => {
  const otherUser = useOtherUser(conversation);
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email as string) !== -1;

  const users = conversation.users;
  const [drewerOpen, setDrawerOpen] = useState(false);

  const statesText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? "Active" : "Offline";
  }, [conversation, isActive]);

  return (
    <>
     <ProfileDrawer 
     data={conversation}
     onOpen={drewerOpen} 
     onClose={() => setDrawerOpen(false)} />
      <div
        className="bg-white w-full flex border-b-[1px] 
    sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm"
      >
        <div className="flex gap-3 items-center">
          <Link
            href={`/conversations`}
            className="lg:hidden block text-sky-500 
        hover:text-sky-600 transition cursor-pointer "
          >
            <HiChevronLeft size={32} />
          </Link>
            {conversation.isGroup ? (
              <AvatarGroup users={users} />
            ) : (
              <Avatar user={otherUser} />
            )}

          <div className="flex flex-col">
            <div>{conversation.name || otherUser.name}</div>
            <div className="text-sm font-light text-neutral-500">
              {statesText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
        />
      </div>
    </>
  );
};

export default ConversationHeader;
