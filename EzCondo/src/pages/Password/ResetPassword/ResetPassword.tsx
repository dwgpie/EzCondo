import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from '~/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { ResetPasswordSchema, resetPasswordSchema } from '~/utils/rules'
import { useMutation } from '@tanstack/react-query'
import { resetPassword } from '~/apis/auth.api'
import { ErrorRespone } from '~/types/utils.type'
import { isAxiosUnprocessableEntityError } from '~/utils/utils'
import Button from '@mui/material/Button'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useContext, useState } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { AppContext } from '~/contexts/app.context'

type FormData = ResetPasswordSchema

export default function ResetPassword() {
  const { setIsAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(resetPasswordSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => resetPassword(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        setIsAuthenticated(true)
        navigate('//confirm-password')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorRespone<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof typeof formError],
                type: 'Server'
              })
            })
          }
        }
      }
    })
    console.log(data)
  })

  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className='w-full h-screen flex justify-center items-center bg-cover bg-center bg-[url(/public/imgs/bg/bg-2.webp)]'>
      <div className='bg-white/50 backdrop-blur-md p-4 rounded-lg shadow-lg w-full max-w-6xl h-[600px] '>
        <div className='flex justify-between items-center p-4'>
          <Link to='/'>
            <button className='border border-[#1f5fa3] text-[#1f5fa3] rounded-full px-5 py-2 font-semibold cursor-pointer hover:bg-[#cfdeee]'>
              Introduction
            </button>
          </Link>
        </div>
        <div className='flex justify-between px-12 py-8'>
          <div className='flex flex-col items-center justify-center'>
            <img src='/public/imgs/logo/lo23-Photoroom.png' className='w-50 h-50 object-cover' />
            <h1 className='text-[#1f5fa3] font-bold text-5xl mt-5'>Reset Password!</h1>
            <p className='text-[#1f5fa3] text-3xl mt-7 w-[460px] text-center'>Enter your new password. </p>
          </div>
          <div className='bg-white/70 p-6 rounded-lg shadow-lg'>
            <form className='rounded w-[350px]' noValidate onSubmit={onSubmit}>
              <h2 className='text-[#1f5fa3] text-3xl font-bold mb-4 text-center'>Reset Password</h2>
              <Input
                name='email'
                type='email'
                placeholder='Email'
                register={register}
                className='mt-7'
                errorMessage={errors.email?.message}
              />
              <Input
                name='code'
                type='code'
                placeholder='Code'
                register={register}
                className='mt-2'
                errorMessage={errors.code?.message}
              />
              <div className='mt-2 relative'>
                <Input
                  name='newPassword'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='New Password'
                  register={register}
                  className='w-full'
                  errorMessage={errors.newPassword?.message}
                  autoComplete='on'
                />
                <InputAdornment position='end' className='absolute right-0 top-0 mt-2 mr-4'>
                  <IconButton onClick={toggleShowPassword} edge='end' aria-label='toggle password visibility'>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              </div>
              <div className='mt-3'>
                <Button
                  type='submit'
                  variant='contained'
                  style={{ color: 'white', background: '#2976ce', fontWeight: 'semi-bold', width: '100%' }}
                >
                  Reset Password
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <Link className='ml-1 text-[#1f5fa3]' to='/login'>
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
