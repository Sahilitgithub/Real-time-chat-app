'use client';
import clsx from 'clsx';
import { FieldValues, UseFormRegister, FieldErrors} from 'react-hook-form';

interface InputProps {
    label: string;
    id: string;
    type?: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    disabled?: boolean;
}

const Input: React.FC<InputProps> = ({label, id, type, required, register, errors, disabled}) => {
  return (
    <div className='mt-2'>
        <label 
        htmlFor={id}
        className='leading-6 font-semibold text-sky-800 text-sm'>{label}</label>

        <div className='mt-0.5'>
            <input 
            id={id} 
            type={type} 
            autoComplete={id}
            disabled={disabled}
            {...register(id, {required})} 
            className={clsx(`
              block
              w-full
              rounded-md
              font-semibold
              border-0
              p-1.5
              ring-2
              ring-gray-500
              text-sky-800
              placeholder:text-gray-300
              focus:ring-2
              focus:ring-inset
              focus:ring-sky-600
              sm:text-sm
              sm:leading-6
            `, 
            errors[id] && "focus:ring-rose-500",
            disabled && "opacity-50 cursor-default" )} />
        </div>
      
    </div>
  )
}

export default Input
