import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { updateProfile, addOrUpdateAvatar, getProfile } from '~/apis/auth.api'
import { profileAdminSchema } from '~/utils/rules'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRef } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { toast } from 'react-toastify'
import { Button } from '@mui/material'
import InputEdit from '~/components/InputEdit'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import LoadingOverlay from '~/components/LoadingOverlay'
import { useTranslation } from 'react-i18next'

interface formData {
  id?: string
  fullName: string
  dateOfBirth: string
  phoneNumber: string
  gender: string
  email: string
  avatar: File
}

export default function Profile() {
  const { t } = useTranslation('profile')
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm<formData>({
    resolver: yupResolver(profileAdminSchema)
  })
  const navigate = useNavigate()
  const { refreshAvatar } = useUser()
  const [image, setImage] = useState<string | File | null>(null)
  const fileInputFrontRef = useRef<HTMLInputElement | null>(null)
  const [user, setUser] = useState<formData | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setValue('avatar', file)
      setImage(imageUrl)
      clearErrors('avatar')
    }
  }

  // // Xử lý kéo & thả ảnh vào ô upload
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setValue('avatar', file)
      setImage(imageUrl)
      clearErrors('avatar')
    }
  }

  const getProfileMutation = useMutation({
    mutationFn: async () => {
      const response = await getProfile()
      return response.data
    },
    onSuccess: (data) => {
      setUser(data)
      // Gán ảnh cũ vào form nếu có
      setValue('avatar', data.avatar)
      console.log('data:', data.avatar)
    },
    onError: (error) => {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error)
    }
  })
  // Lưu mutate vào useRef
  const mutateRef = useRef(getProfileMutation.mutate)

  useEffect(() => {
    mutateRef.current() // Gọi mutate từ ref để tránh dependency issue
  }, [])

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setLoading(true)
      setProgress(0)

      const Progress = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(Progress)
            return prev
          }
          return prev + 3
        })
      }, 150)

      // Xử lý upload avatar trước
      if (formData.avatar instanceof File) {
        await addOrUpdateAvatar(formData.avatar)
        await refreshAvatar() // Refresh avatar từ server thay vì dùng URL trực tiếp
      }

      // Sau đó cập nhật thông tin profile
      await updateProfile({
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber
      })

      toast.success(t('success'), {
        style: { width: 'fit-content' }
      })
      getProfileMutation.mutate()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  })

  const getImageSrc = (image: string | File | null | undefined) => {
    if (image instanceof File) {
      return URL.createObjectURL(image)
    }
    return image || undefined
  }

  return (
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && <LoadingOverlay value={progress} />}
      {user ? (
        <form className='rounded' noValidate onSubmit={onSubmit}>
          <div className='flex items-center justify-evenly gap-4'>
            <div>
              <div className='w-[300px]'>
                <label className='block text-sm font-semibold'>
                  {t('name')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <InputEdit
                  name='fullName'
                  type='text'
                  className='mt-1'
                  errorMessage={errors.fullName?.message}
                  defaultValue={user.fullName}
                  register={register}
                />
              </div>
              <div className=''>
                <label className='block text-sm font-semibold'>
                  {t('phone')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <InputEdit
                  name='phoneNumber'
                  type='text'
                  className='mt-1'
                  errorMessage={errors.phoneNumber?.message}
                  defaultValue={user.phoneNumber}
                  register={register}
                />
              </div>
            </div>
            <div>
              <div className='w-[300px]'>
                <label className='block text-sm font-semibold'>{t('email')}</label>
                <InputEdit
                  name='email'
                  type='text'
                  className='mt-1'
                  defaultValue={user.email}
                  register={register}
                  isEditable={false}
                />
              </div>
              <div className=''>
                <label className='block text-sm font-semibold'>
                  {t('dob')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <InputEdit
                  name='dateOfBirth'
                  type='date'
                  className='mt-1'
                  errorMessage={errors.dateOfBirth?.message}
                  defaultValue={user.dateOfBirth?.split('T')[0]}
                  register={register}
                />
              </div>
              <div className=''>
                <label className='block text-sm font-semibold mb-1'>
                  {t('gender')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <select
                  className='w-full h-11 pl-2 outline-none border bg-white border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  defaultValue={user.gender || ''}
                  {...register('gender')}
                >
                  <option value='male'>{t('male')}</option>
                  <option value='female'>{t('female')}</option>
                  <option value='other'>{t('other')}</option>
                </select>
              </div>
            </div>
            <div className=''>
              <div
                className='mt-2 w-[200px] h-[200px] p-2 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center cursor-pointer bg-gray-100 overflow-hidden'
                onClick={() => fileInputFrontRef.current?.click()}
                onDrop={(e) => handleDrop(e)}
                onDragOver={(e) => e.preventDefault()}
              >
                {image || user.avatar ? (
                  <img
                    src={getImageSrc(image) || getImageSrc(user?.avatar)}
                    alt='Preview'
                    className='w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-300'
                  />
                ) : (
                  <>
                    <div className='flex-col items-center justify-center text-center'>
                      <CloudUploadIcon className='text-gray-700 text-4xl' />
                      <p className='text-gray-700 font-semibold'>{t('upload')}</p>
                      <p className='text-gray-500 text-sm'>{t('drag')}</p>
                    </div>
                  </>
                )}
                <input
                  type='file'
                  {...register('avatar')}
                  accept='image/*'
                  ref={fileInputFrontRef}
                  className='hidden'
                  onChange={(e) => handleImageChange(e)}
                />
              </div>
              <div className='flex items-center justify-center gap-4 mt-7'>
                <Button
                  onClick={() => navigate(-1)}
                  variant='contained'
                  style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }}
                >
                  {t('cancel')}
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  style={{ color: 'white', background: '#2976ce', fontWeight: 'semi-bold' }}
                >
                  {t('submit')}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <p>{t('loading')}</p>
      )}
    </div>
  )
}
