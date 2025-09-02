'use client';
import ReactSelect from 'react-select'

interface OptionType {
    label: string;
    value: string | number;
}

interface SelectProps {
    label: string;
    value: OptionType[];
    onChange: (value: OptionType[]) => void;
    options: OptionType[];
    disabled?: boolean;
}

const Select:React.FC<SelectProps> = ({
    label,
    value,
    options,
    onChange,
    disabled
}) => {
  return (
    <div className="z-[100]">
      <label htmlFor={label} 
      className="block text-sm font-semibold leading-6 text-gray-900" >{label}</label>
      
      <div className="mt-2">
          <ReactSelect 
          isDisabled={disabled}
          value={value}
          onChange={(newValue) => onChange(newValue as OptionType[])}
          isMulti
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999
            })
          }}
          classNames={{
            control: () => 'text-sm',
          }}
          />
      </div>
    </div>
  )
}

export default Select
