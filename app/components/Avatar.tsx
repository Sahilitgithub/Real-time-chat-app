"use client"
import { User } from "@prisma/client"
import Image from "next/image"
import useActiveList from "../hooks/useActiveList"

interface AvatarProps {
    user?: User | null
}
const Avatar = ({ user }: AvatarProps) => {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email as string) !== -1;


  return (
    <div className="relative">
      <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-10 md:w-10">
        <Image 
          src={user?.image || "/images/placeholder.jpg"}
          alt="Avatar"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      {isActive && (
        <div className="absolute block rounded-full bg-green-500 h-2 w-2 top-0 right-0 md:h-3 md:w-3 " />
      )}
    </div>
  )
}

export default Avatar
