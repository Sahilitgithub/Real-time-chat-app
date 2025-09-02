"use client";
import clsx from 'clsx'

interface ButtonProps {
    type: 'button' | 'submit' | 'reset' | undefined;
    onClick?: () => void;
    fullWidth?: boolean;
    children: React.ReactNode;
    disabled?: boolean
    secondary?: boolean
    danger?: boolean
}

const Button: React.FC<ButtonProps> = ({
    type, 
    onClick,
    fullWidth, 
    children,
    disabled,
    secondary,
    danger
}) => {
  return (
    <button 
    type={type} 
    onClick={onClick} 
    disabled={disabled}
    className={clsx(`
        flex
        justify-center
        rounded-md
        px-3
        py-2
        text-sm
        font-semibold
        focus-visible:outline-2
        focus-visible:outline-offset-2
    `, 
    fullWidth && "w-full",
    disabled && "opacity-50 cursor-default",
    secondary ? "text-gray-900" : "text-white",
    danger && "bg-red-500 hover:bg-rose-600 focus-visible:outline-red-500",
    !secondary && !danger && "bg-sky-600 hover:bg-sky-700 focus-visible:outline-sky-600 transition-colors")}>
      {children}
    </button>
  )
}

export default Button
