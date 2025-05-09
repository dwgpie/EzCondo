import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { getUserById } from '~/apis/user.api'
import { registerSchema } from '~/utils/rules'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRef } from 'react'
import HideImageIcon from '@mui/icons-material/HideImage'
import { Button } from '@mui/material'
import InputEdit from '~/components/InputEdit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface formData {
  id?: string
  fullName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  roleName: string
  apartmentNumber: string
  status: string
  userId?: string
  no: string
  dateOfIssue: string
  dateOfExpiry: string
  frontImage: File
  backImage: File
}

export default function DetailResident() {
  const {
    register,
    setValue,
    formState: { errors }
  } = useForm<formData>({
    resolver: yupResolver(registerSchema)
  })

  const { t } = useTranslation('user')
  const fileInputFrontRef = useRef<HTMLInputElement | null>(null)
  const fileInputBackRef = useRef<HTMLInputElement | null>(null)
  const [user, setUser] = useState<formData | null>(null)

  const getUserIdFromURL = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('userId') // Đảm bảo đúng với cách truyền userId
  }

  const userId = getUserIdFromURL()

  const getUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await getUserById(id)
      return response.data
    },
    onSuccess: (data) => {
      setUser(data)
      // Gán ảnh cũ vào form nếu có
      setValue('frontImage', data.frontImage)
      setValue('backImage', data.backImage)
    },
    onError: (error) => {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error)
    }
  })

  useEffect(() => {
    if (userId) {
      getUserMutation.mutate(userId)
    }
  }, [userId])

  const getImageSrc = (image: string | File | null | undefined) => {
    if (image instanceof File) {
      return URL.createObjectURL(image)
    }
    return image || undefined
  }

  return (
    <div className='mx-5 mt-5 mb-5 py-3 px-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      <h2 className='text-xl mb-4 text-gray-500 font-semibold'>{t('account_information')}</h2>
      {user ? (
        <form className='rounded' noValidate>
          <div className='grid grid-cols-4 gap-4'>
            <div className=''>
              <label className='block text-sm font-semibold'>
                {t('name')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <InputEdit
                name='fullName'
                type='text'
                className='mt-1 pointer-events-none'
                errorMessage={errors.fullName?.message}
                defaultValue={user.fullName} // Sử dụng defaultValue thay vì value
                register={register}
              />
            </div>
            <div className=''>
              <label className='block text-sm font-semibold'>
                {t('phone_number')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <InputEdit
                name='phoneNumber'
                type='text'
                className='mt-1 pointer-events-none'
                errorMessage={errors.phoneNumber?.message}
                defaultValue={user.phoneNumber}
                register={register}
              />
            </div>
            <div className=''>
              <label className='block text-sm font-semibold'>
                {t('email')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <InputEdit
                name='email'
                type='text'
                className='mt-1 pointer-events-none'
                errorMessage={errors.email?.message}
                defaultValue={user.email}
                register={register}
              />
            </div>
            <div className=''>
              <label className='block text-sm font-semibold'>
                {t('apartment')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <InputEdit
                name='apartmentNumber'
                type='text'
                className='mt-1 pointer-events-none'
                errorMessage={errors.apartmentNumber?.message}
                defaultValue={user.apartmentNumber}
                register={register}
              />
            </div>
          </div>
          <div className='grid grid-cols-4 gap-4'>
            <div className='mt-3'>
              <label className='block text-sm font-semibold'>{t('date_of_birth')}</label>
              <InputEdit
                name='dateOfBirth'
                type='date'
                className='mt-1 pointer-events-none'
                errorMessage={errors.dateOfBirth?.message}
                defaultValue={user.dateOfBirth?.split('T')[0]} // Chỉ lấy phần YYYY-MM-DD để input hoạt động
                register={register}
              />
            </div>
            <div className='mt-3'>
              <label className='block text-sm font-semibold'>{t('gender')}</label>
              <InputEdit
                name='gender'
                type='text'
                className='mt-1 pointer-events-none'
                errorMessage={errors.gender?.message}
                defaultValue={user.gender}
                register={register}
              />
            </div>
            <div className='mt-3'>
              <label className='block text-sm font-semibold'>{t('role')}</label>
              <InputEdit
                name='roleName'
                type='text'
                className='mt-1 pointer-events-none'
                errorMessage={errors.roleName?.message}
                defaultValue={user.roleName}
                register={register}
              />
            </div>
            <div className='mt-3'>
              <label className='block text-sm font-semibold'>{t('status')}</label>
              <InputEdit
                name='status'
                type='text'
                className='mt-1 pointer-events-none'
                errorMessage={errors.status?.message}
                defaultValue={user.status}
                register={register}
              />
            </div>
          </div>

          <div className='mt-3'>
            <h3 className='text-lg mb-3 font-semibold text-gray-500'>{t('citizen_identity_number')}</h3>
            <div className='grid grid-cols-3 gap-4'>
              <div className=''>
                <label className='block text-sm font-semibold'>
                  {t('no')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <InputEdit
                  name='no'
                  type='text'
                  className='mt-1 pointer-events-none'
                  errorMessage={errors.no?.message}
                  defaultValue={user.no}
                  register={register}
                />
              </div>
              <div className=''>
                <label className='block text-sm font-semibold'>
                  {t('date_of_issue')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <InputEdit
                  name='dateOfIssue'
                  type='date'
                  className='mt-1 pointer-events-none'
                  errorMessage={errors.dateOfIssue?.message}
                  defaultValue={user.dateOfIssue}
                  register={register}
                />
              </div>
              <div className=''>
                <label className='block text-sm font-semibold'>
                  {t('date_of_expiry')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <InputEdit
                  name='dateOfExpiry'
                  type='date'
                  className='mt-1 pointer-events-none'
                  errorMessage={errors.dateOfExpiry?.message}
                  defaultValue={user.dateOfExpiry}
                  register={register}
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4 mt-4'>
              <div>
                <label className='block text-sm font-semibold'>{t('front_image')}</label>
                <div className=' mt-2 w-full h-auto p-4 border-2 border-dashed border-blue-400 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-100'>
                  {user.frontImage ? (
                    <img
                      src={getImageSrc(user?.frontImage)}
                      alt='Preview'
                      className='w-full h-full object-cover rounded-md'
                    />
                  ) : (
                    <>
                      <HideImageIcon />
                      <p className='text-gray-700 font-semibold'>{t('no_photos') || 'No photos'}</p>
                    </>
                  )}
                  <input
                    type='file'
                    {...register('frontImage')}
                    accept='image/*'
                    ref={fileInputFrontRef}
                    className='hidden'
                  />
                </div>
                <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.frontImage?.message}</div>
              </div>

              <div>
                <label className='block text-sm font-semibold'>{t('back_image')}</label>
                <div className='mt-2 w-full h-auto p-4 border-2 border-dashed border-blue-400 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-100'>
                  {user.backImage ? (
                    <img
                      src={getImageSrc(user?.backImage)}
                      alt='Preview'
                      className='w-full h-full object-cover rounded-md'
                    />
                  ) : (
                    <>
                      <HideImageIcon />
                      <p className='text-gray-700 font-semibold'>{t('no_photos') || 'No photos'}</p>
                    </>
                  )}
                  <input
                    type='file'
                    {...register('backImage')}
                    accept='image/*'
                    ref={fileInputBackRef}
                    className='hidden'
                  />
                </div>
                <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.frontImage?.message}</div>
              </div>
            </div>
          </div>
          <div className='flex justify-end gap-4 mt-3'>
            <Link to='/manager/list-resident'>
              <Button variant='contained' style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }}>
                {t('cancel')}
              </Button>
            </Link>
          </div>
        </form>
      ) : (
        <p>{t('loading_data')}</p>
      )}
    </div>
  )
}
