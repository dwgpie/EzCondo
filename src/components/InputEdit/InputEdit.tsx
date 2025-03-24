import React from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props {
  type: React.HTMLInputTypeAttribute
  errorMessage?: string
  placeholder?: string
  className?: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autoComplete?: string
  defaultValue: string // Thêm value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  rules?: RegisterOptions
  isEditable?: boolean
}

export default function InputEdit({
  type,
  errorMessage,
  placeholder,
  className,
  autoComplete,
  defaultValue,
  name,
  register,
  rules,
  isEditable = true
}: Props) {
  return (
    <div className={className}>
      <input
        type={type}
        className='w-full h-11 pl-2 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={defaultValue} // Thêm value vào input
        readOnly={!isEditable}
        {...register(name, rules)}
      />
      <div className='mt-1 text-xs text-red-500 min-h-4'>{errorMessage}</div>
    </div>
  )
}
