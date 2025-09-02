'use client';

import { FieldErrors, UseFormRegister, FieldValues } from "react-hook-form";

interface MessageInputProps {
    id: string;
    required?: boolean;
    placeholder?: string;
    type?: string;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
}

const MessageInput:React.FC<MessageInputProps> = (
    { id, required, placeholder, type, register }) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
       className="w-full border-2 border-neutral-300 rounded-full py-2 px-4 focus:outline-none focus:border-sky-500"
        />
    </div>
  )
}

export default MessageInput
