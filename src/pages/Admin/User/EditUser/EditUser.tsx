import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { addOrUpdateCitizen } from '~/apis/citizen.api'
import { editUser, getUserById } from '~/apis/user.api'
import { registerSchema } from '~/utils/rules'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRef } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { toast } from 'react-toastify'
import { Button } from '@mui/material'
import InputEdit from '~/components/InputEdit'
import { Link } from 'react-router-dom'
import LoadingOverlay from '~/components/LoadingOverlay'

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

export default function EditUser() {
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
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)

      if (type === 'front') {
        setValue('frontImage', file)
        setImagePreviewFront(imageUrl)
        clearErrors('frontImage')
      } else {
        setValue('backImage', file)
        setImagePreviewBack(imageUrl)
        clearErrors('backImage')
      }
    }
  }

  // Xử lý kéo & thả ảnh vào ô upload
  const handleDrop = (event: React.DragEvent<HTMLDivElement>, type: 'front' | 'back') => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      if (type === 'front') {
        setValue('frontImage', file)
        setImagePreviewFront(imageUrl)
        clearErrors('frontImage')
      } else {
        setValue('backImage', file)
        setImagePreviewBack(imageUrl)
        clearErrors('backImage')
      }
    }
  }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const onSubmit = handleSubmit((formData) => {
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

      editUser({
        id: userId ?? '',
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        gender: formData.gender,
        apartmentNumber: formData.apartmentNumber,
        roleName: formData.roleName,
        status: formData.status
      })
      addOrUpdateCitizen({
        userId: userId ?? '',
        no: formData.no,
        dateOfIssue: formData.dateOfIssue,
        dateOfExpiry: formData.dateOfExpiry,
        frontImage: formData.frontImage,
        backImage: formData.backImage
      })
      toast.success('User updated successfully!', {
        style: { width: 'fit-content' }
      })
    } catch (error) {
      console.error('Error updating user or citizen:', error)
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
    <div className='mx-5 mt-5 mb-5 py-3 px-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && <LoadingOverlay value={progress} />}
      <h2 className='text-xl mb-4 text-gray-500 font-semibold'>Account Information</h2>
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
                className='mt-1'
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
                className='mt-1'
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
                className='mt-1'
                errorMessage={errors.email?.message}
                defaultValue={user.email}
                register={register}
              />
            </div>
            <div className=''>
              <label className='block text-sm font-semibold'>
                Date of birth
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <InputEdit
                name='dateOfBirth'
                type='date'
                className='mt-1'
                errorMessage={errors.dateOfBirth?.message}
                defaultValue={user.dateOfBirth?.split('T')[0]} // Chỉ lấy phần YYYY-MM-DD để input hoạt động
                register={register}
              />
            </div>
          </div>
          <div className='grid grid-cols-4 gap-4'>
            <div className='mt-3'>
              <label className='block text-sm font-semibold'>
                Gender
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <select
                {...register('gender')}
                defaultValue={user.gender}
                className='mt-1 w-full py-[13px] pl-2 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              >
                <option value='female'>Female</option>
                <option value='male'>Male</option>
                <option value='other'>Other</option>
              </select>
            </div>
            <div className='mt-3'>
              <label className='block text-sm font-semibold'>
                Status
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <select
                {...register('status')}
                defaultValue={user.status}
                className='mt-1 w-full py-[13px] pl-2 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              >
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
              </select>
            </div>
            <div className='mt-3'>
              <label className='block text-sm font-semibold'>Role</label>
              <InputEdit
                name='roleName'
                type='text'
                className='mt-1'
                defaultValue={user.roleName}
                register={register}
                isEditable={false}
              />
            </div>
            <div className='mt-3'>
              <label className='block text-sm font-semibold'>Apartment</label>
              <InputEdit
                name='apartmentNumber'
                type='text'
                className='mt-1'
                errorMessage={errors.apartmentNumber?.message}
                defaultValue={user.apartmentNumber}
                register={register}
                isEditable={false}
              />
            </div>
          </div>

          <div className='mt-3'>
            <h3 className='text-lg mb-3 font-semibold text-gray-500'>Citizen Identity Number</h3>
            <div className='grid grid-cols-3 gap-4'>
              <div className=''>
                <label className='block text-sm font-semibold'>
                  No
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <InputEdit
                  name='no'
                  type='text'
                  className='mt-1'
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
                  className='mt-1'
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
                  className='mt-1'
                  errorMessage={errors.dateOfExpiry?.message}
                  defaultValue={user.dateOfExpiry}
                  register={register}
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4 mt-4'>
              <div>
                <label className='block text-sm font-semibold'>
                  Font Image
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <div
                  className='mt-2 w-full h-auto p-4 border-2 border-dashed border-blue-400 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-100'
                  onClick={() => fileInputFrontRef.current?.click()}
                  onDrop={(e) => handleDrop(e, 'front')}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {imagePreviewFront || user.frontImage ? (
                    <img
                      src={getImageSrc(imagePreviewFront) || getImageSrc(user?.frontImage)}
                      alt='Preview'
                      className='w-full h-full object-cover rounded-md'
                    />
                  ) : (
                    <>
                      <CloudUploadIcon className='text-gray-700 text-4xl' />
                      <p className='text-gray-700 font-semibold'>Upload a File</p>
                      <p className='text-gray-500 text-sm'>Drag and drop files here</p>
                    </>
                  )}
                  <input
                    type='file'
                    {...register('frontImage')}
                    accept='image/*'
                    ref={fileInputFrontRef}
                    className='hidden'
                    onChange={(e) => handleImageChange(e, 'front')}
                  />
                </div>
                <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.frontImage?.message}</div>
              </div>

              <div>
                <label className='block text-sm font-semibold'>
                  Back Image
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <div
                  className='mt-2 w-full h-auto p-4 border-2 border-dashed border-blue-400 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-100'
                  onClick={() => fileInputBackRef.current?.click()}
                  onDrop={(e) => handleDrop(e, 'back')}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {imagePreviewBack || user.backImage ? (
                    <img
                      src={getImageSrc(imagePreviewBack) || getImageSrc(user?.backImage)}
                      alt='Preview'
                      className='w-full h-full object-cover rounded-md'
                    />
                  ) : (
                    <>
                      <CloudUploadIcon className='text-gray-700 text-4xl' />
                      <p className='text-gray-700 font-semibold'>Upload a File</p>
                      <p className='text-gray-500 text-sm'>Drag and drop files here</p>
                    </>
                  )}
                  <input
                    type='file'
                    {...register('backImage')}
                    accept='image/*'
                    ref={fileInputBackRef}
                    className='hidden'
                    onChange={(e) => handleImageChange(e, 'back')}
                  />
                </div>
                <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.backImage?.message}</div>
              </div>
            </div>
          </div>
          <div className='flex justify-end gap-4 mt-3'>
            <Link to='/admin/list-user'>
              <Button variant='contained' style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }}>
                Cancel
              </Button>
            </Link>
            <Button
              type='submit'
              variant='contained'
              style={{ color: 'white', background: '#2976ce', fontWeight: 'semi-bold' }}
            >
              Submit
            </Button>
          </div>
        </form>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  )
}
