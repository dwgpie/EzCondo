import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Input from '~/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { verifySchema, VerifyOtpSchema } from '~/utils/rules'
import { useMutation } from '@tanstack/react-query'
import { verifyOTP } from '~/apis/auth.api'
import Button from '@mui/material/Button'
import { useContext } from 'react'
import { AppContext } from '~/contexts/app.context'

type FormData = VerifyOtpSchema

export default function VerifyOTP() {
  const { setIsAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()
  const location = useLocation()
  const emailFromState = location.state?.email

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(verifySchema),
    defaultValues: {
      email: emailFromState
    }
  })

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => verifyOTP(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        setIsAuthenticated(true)
        navigate('/reset-password', { state: { tokenMemory: response.data } })
      },
      onError: (error) => {
        console.log(error)
      }
    })
  })

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
            <h1 className='text-[#1f5fa3] font-bold text-5xl mt-5'> Verify OTP !</h1>
            <p className='text-[#1f5fa3] text-3xl mt-7 w-[460px] text-center'>Enter your OTP.</p>
          </div>
          <div className='bg-white/70 p-6 rounded-lg shadow-lg'>
            <form className='rounded w-[350px]' noValidate onSubmit={onSubmit}>
              <h2 className='text-[#1f5fa3] text-3xl font-bold mb-4 text-center'> Verify OTP</h2>
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
              <div className='mt-3'>
                <Button
                  type='submit'
                  variant='contained'
                  style={{ color: 'white', background: '#2976ce', fontWeight: 'semi-bold', width: '100%' }}
                >
                  Comfirm
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
