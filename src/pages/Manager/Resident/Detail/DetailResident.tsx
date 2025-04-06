import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { editUser, getUserById } from '~/apis/user.api'
import { addOrUpdateCitizen } from '~/apis/citizen.api'
import { registerSchema } from '~/utils/rules'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRef } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import HideImageIcon from '@mui/icons-material/HideImage'
import { ToastContainer, toast } from 'react-toastify'
import { Button } from '@mui/material'
import InputEdit from '~/components/InputEdit'
import { Link } from 'react-router-dom'

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
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm<formData>({
    resolver: yupResolver(registerSchema)
  })

  const [imagePreviewFront, setImagePreviewFront] = useState<string | File | null>(null)
  const [imagePreviewBack, setImagePreviewBack] = useState<string | null>(null)

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
      console.log('Dữ liệu người dùng:', data)
      setUser(data) // Cập nhật state với dữ liệu từ API
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

  const onSubmit = handleSubmit((formData) => {})

  const getImageSrc = (image: string | File | null | undefined) => {
    if (image instanceof File) {
      return URL.createObjectURL(image)
    }
    return image || undefined
  }

  return (
    <div style={{ height: 'calc(100vh - 80px)' }} className='pt-5 ml-5 mr-5 z-13 '>
      <ToastContainer />
      <div className='mb-6 p-6 bg-white drop-shadow-md rounded-xl'>
        <h2 className='text-xl mb-4 text-black font-semibold'>Account Information</h2>
        {user ? (
          <form className='rounded' noValidate onSubmit={onSubmit}>
            <div className='grid grid-cols-4 gap-4'>
              <div className=''>
                <label className='block text-sm font-semibold'>
                  Name
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
                  Phone number
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
                  Email
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
                  Apartment
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
                <label className='block text-sm font-semibold'>Date of birth</label>
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
                <label className='block text-sm font-semibold'>Gender</label>
                <InputEdit
                  name='gender'
                  type='text'
                  className='mt-1 pointer-events-none'
                  errorMessage={errors.gender?.message}
                  defaultValue={user.gender} // Chỉ lấy phần YYYY-MM-DD để input hoạt động
                  register={register}
                />
              </div>
              <div className='mt-3'>
                <label className='block text-sm font-semibold'>Role</label>
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
                <label className='block text-sm font-semibold'>Status</label>
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

            <div className='mt-4'>
              <h3 className='text-lg mb-4 font-semibold'>Citizen Identity Card</h3>
              <div className='grid grid-cols-3 gap-4'>
                <div className=''>
                  <label className='block text-sm font-semibold'>
                    No
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
                    Date of issue
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
                    Date of expiry
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
                  <label className='block text-sm font-semibold'>Font Image</label>
                  <div className='mt-2 w-full h-auto p-4 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-100'>
                    {user.frontImage ? (
                      <img
                        src={getImageSrc(user?.frontImage)}
                        alt='Preview'
                        className='w-full h-full object-cover rounded-md'
                      />
                    ) : (
                      <>
                        <HideImageIcon />
                        <p className='text-gray-700 font-semibold'>No photos</p>
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
                  <label className='block text-sm font-semibold'>Back Image</label>
                  <div className='mt-2 w-full h-auto p-4 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-100'>
                    {user.backImage ? (
                      <img
                        src={getImageSrc(user?.backImage)}
                        alt='Preview'
                        className='w-full h-full object-cover rounded-md'
                      />
                    ) : (
                      <>
                        <HideImageIcon />
                        <p className='text-gray-700 font-semibold'>No photos</p>
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
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        ) : (
          <p>Đang tải dữ liệu...</p>
        )}
      </div>
    </div>
  )
}
