"use client";
import ReactSelect from 'react-select'

interface SelectProps {
    disabled?: boolean;
    label: string;
    options: {value: string, label: string}[];
    onChange: (value: string) => void;
    value?: string
}

const Select:React.FC<SelectProps> = ({
    disabled,
    label,
    options,
    onChange,
    value
}) => {
  return (
    <div className="z-[100]">
      <label 
      htmlFor={label} 
      className="block text-sm font-medium leading-6 text-gray-900" >{label}</label>

      <div className="mt-2">
            <ReactSelect 
            isDisabled={disabled}
            value={value}
            // @ts-expect-error client component
            onChange={onChange}
            isMulti
            // @ts-expect-error for user options
            options={options}
            menuPortalTarget={document.body}
            styles={{
                menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999
                })
            }} 
            classNames={{
                control: () => "text-sm"
            }} />
      </div>
    </div>
  )
}

export default Select
