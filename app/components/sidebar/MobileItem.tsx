'use client'
import clsx from "clsx";
import Link from "next/link";
import { IconType } from "react-icons";
import React, { FC } from "react";

interface MobileItemProps {
    href: string;
    icon: IconType;
    active?: boolean;
    onClick?: () => void; 
}

const MobileItem:FC<MobileItemProps> = ({
    href,
    icon: Icon,
    active,
    onClick
}) => {

    const handleClick = () => {
        if(onClick){
            return onClick()
        }
    }

  return (
    <Link 
    onClick={handleClick}
    href={href} 
    className={clsx(`
        group,
        flex 
        gap-x-3
        text-sm
        leading-6
        font-semibold
        w-full
        justify-center
        p-4
        text-gray-500
        hover:text-black
        hover:bg-gray-100
        rounded-md
    `, 
    active && "bg-gray-300 text-black" )} >
      <Icon className="w-5 h-5" />
    </Link>
  )
}

export default MobileItem
