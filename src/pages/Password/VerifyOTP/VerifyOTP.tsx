import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { verifySchema, VerifyOtpSchema } from '~/utils/rules'
import { useMutation } from '@tanstack/react-query'
import { verifyOTP } from '~/apis/auth.api'
import Button from '@mui/material/Button'
import { toast } from 'react-toastify'
import OtpInput from 'react-otp-input'
import { useState, useEffect } from 'react'

type FormData = VerifyOtpSchema

export default function VerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation()
  const emailFromState = location.state?.email

  const {
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(verifySchema),
    defaultValues: {
      email: emailFromState,
      code: ''
    }
  })
  const loginMutation = useMutation({
    mutationFn: (body: FormData) => verifyOTP(body)
  })

  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(300)
  const [isTimerExpired, setIsTimerExpired] = useState(false)

  useEffect(() => {
    if (timeLeft === 0) {
      setIsTimerExpired(true)
      return
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(timerId)
  }, [timeLeft])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        toast.success('Verify OTP successfully', {
          style: { width: 'fit-content' }
        })
        navigate('/reset-password', { state: { tokenMemory: response } })
      },
      onError: (error) => {
        console.log(error)
      }
    })
  })

  return (
    <div className='w-full h-screen flex justify-center items-center bg-cover bg-center bg-[url(/imgs/bg/bgm-2.jpg)]'>
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
            <img src='/imgs/logo/lo23-Photoroom.png' className='w-50 h-50 object-cover' />
            <h1 className='text-[#1f5fa3] font-bold text-5xl mt-5'> Verify OTP !</h1>
            <p className='text-[#1f5fa3] text-3xl mt-7 w-[460px] text-center'>Enter your OTP.</p>
            <div className='mt-6 text-center'>
              {isTimerExpired ? (
                <p className='text-red-600 font-semibold text-xl'>Time has expired. Please request a new OTP.</p>
              ) : (
                <p className='text-[#1f5fa3] font-semibold text-2xl'>Time left: {formattedTime}</p>
              )}
            </div>
          </div>
          <div className='bg-white/70 p-6 rounded-lg shadow-lg'>
            <form className='rounded w-[350px]' noValidate onSubmit={onSubmit}>
              <h2 className='text-[#1f5fa3] text-3xl font-bold mb-4 text-center'>Verify OTP</h2>
              <OtpInput
                value={otp}
                onChange={(value) => {
                  setOtp(value)
                  setValue('code', value)
                }}
                numInputs={6}
                renderInput={(props, index) => (
                  <input
                    {...props}
                    style={{
                      width: '40px',
                      height: '40px',
                      margin: '0 5px',
                      fontSize: '18px',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      textAlign: 'center',
                      outline: 'none',
                      border: errors.code ? '2px solid #e53e3e' : otp[index] ? '2px solid #006eff' : '1px solid #ccc',
                      transition: 'border-color 0.3s ease'
                    }}
                    disabled={isTimerExpired}
                  />
                )}
                containerStyle={{ justifyContent: 'center', marginTop: '40px' }}
              />
              <div className='min-h-[20px] mt-2 text-center'>
                <p className='text-red-500 text-sm mt-2 text-center'>{errors.code?.message}</p>
              </div>
              <div className='mt-4'>
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
