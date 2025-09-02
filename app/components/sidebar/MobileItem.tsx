"use client";
import clsx from "clsx";
import Link from "next/link";
import { IconType } from "react-icons";

interface MobileItemProps {
    href: string;
    icon: IconType;
    onClick?: () => void;
    active?: boolean;
}

const MobileItem = ({ href, icon: Icon, onClick, active }: MobileItemProps) => {

    const handleClick = () => {
        if(onClick) {
            return onClick()
        }
    }

  return (
    <Link 
    onClick={handleClick} 
    href={href}
    className={clsx(`group flex gap-x-3 text-sm
    leading-6 font-semibold w-full justify-center p-4
    text-gray-500 hover:text-gray-900 hover:bg-gray-100 `,
    active && "bg-gray-100 text-black")}>
      <Icon className="h-5 w-5" />
    </Link>
  )
}

export default MobileItem
