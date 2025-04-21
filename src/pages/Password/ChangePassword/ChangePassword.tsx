import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { changePasswordSchema } from '~/utils/rules'
import { useMutation } from '@tanstack/react-query'
import { changePassword } from '~/apis/auth.api'
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify'
import Input from '~/components/Input'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState } from 'react'
import { IconButton, InputAdornment } from '@mui/material'

interface FormData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(changePasswordSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => changePassword(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        reset()
        toast.success('Change password successfully!', {
          style: { width: 'fit-content' }
        })
      }
    })
  })

  const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const [showPassword2, setShowPassword2] = useState(false)
  const toggleShowPassword2 = () => {
    setShowPassword2((prev) => !prev)
  }

  const [showPassword3, setShowPassword3] = useState(false)
  const toggleShowPassword3 = () => {
    setShowPassword3((prev) => !prev)
  }

  return (
    <div className='pt-5 mx-5 z-13' style={{ height: 'calc(100vh - 80px)' }}>
      <ToastContainer />
      <div className='mb-6 p-6 bg-gradient-to-br from-white via-white to-blue-100 shadow-xl rounded-2xl space-y-6'>
        <form className='rounded' noValidate onSubmit={onSubmit}>
          <div className=''>
            <div className='flex gap-10'>
              <div>
                <label className='block text-sm font-semibold'>
                  Old Passowrd
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <div className='relative'>
                  <Input
                    name='oldPassword'
                    type={showPassword ? 'text' : 'password'}
                    register={register}
                    className='mt-3 w-[250px]'
                    errorMessage={errors.oldPassword?.message}
                  />
                  <InputAdornment position='end' className='absolute right-0 top-0 mt-2 mr-4'>
                    <IconButton onClick={toggleShowPassword} edge='end' aria-label='toggle password visibility'>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                </div>
              </div>
              <div>
                <label className='block text-sm font-semibold'>
                  New Passowrd
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <div className='relative'>
                  <Input
                    name='newPassword'
                    type={showPassword2 ? 'text' : 'password'}
                    register={register}
                    className='mt-3 w-[250px]'
                    errorMessage={errors.newPassword?.message}
                  />
                  <InputAdornment position='end' className='absolute right-0 top-0 mt-2 mr-4'>
                    <IconButton onClick={toggleShowPassword2} edge='end' aria-label='toggle password visibility'>
                      {showPassword2 ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                </div>
              </div>
              <div>
                <label className='block text-sm font-semibold'>
                  Confirm Passowrd
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <div className='relative'>
                  <Input
                    name='confirmPassword'
                    type={showPassword3 ? 'text' : 'password'}
                    register={register}
                    className='mt-3 w-[250px]'
                    errorMessage={errors.confirmPassword?.message}
                  />
                  <InputAdornment position='end' className='absolute right-0 top-0 mt-2 mr-4'>
                    <IconButton onClick={toggleShowPassword3} edge='end' aria-label='toggle password visibility'>
                      {showPassword3 ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                </div>
              </div>
            </div>
            <div className='flex items-center mt-6 gap-6'>
              <Button
                type='submit'
                variant='contained'
                style={{ color: 'white', background: '#2976ce', fontWeight: 'semi-bold' }}
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
