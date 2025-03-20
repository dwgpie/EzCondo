import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props {
  type: React.HTMLInputTypeAttribute
  errorMessage?: string
  placeholder?: string
  className?: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  rules?: RegisterOptions
  autoComplete?: string
  rows?: number
}

export default function Input({
  type,
  errorMessage,
  placeholder,
  className,
  name,
  register,
  rules,
  autoComplete,
  rows
}: Props) {
  return (
    <div className={className}>
      {type === 'textarea' ? (
        <textarea
          className='w-full pl-2 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm p-2'
          placeholder={placeholder}
          {...register(name, rules)}
          rows={rows}
        ></textarea>
      ) : (
        <input
          type={type}
          className='w-full h-11 pl-2 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
          placeholder={placeholder}
          {...register(name, rules)}
          autoComplete={autoComplete}
        />
      )}
      <div className='mt-1 text-xs text-red-500 min-h-4'>{errorMessage}</div>
    </div>
  )
}
