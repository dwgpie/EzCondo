import { Button } from '@mui/material'
import SideBarAdmin from '~/components/SideBar/SideBarAdmin'
import { useForm } from 'react-hook-form'
import Input from '~/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { addUserSchema } from '~/utils/rules'
import { registerAccount, addOrUpdateCitizen } from '~/apis/auth.api'
import { useRef, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { ToastContainer, toast } from 'react-toastify'

interface FormData {
  fullName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  roleName: string
  apartmentNumber: string
  userId?: string
  no: string
  dateOfIssue: string
  dateOfExpiry: string
  frontImage: File
  backImage: File
}

export default function AddUser() {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(addUserSchema)
  })

  const [imagePreviewFront, setImagePreviewFront] = useState<string | null>(null)
  const [imagePreviewBack, setImagePreviewBack] = useState<string | null>(null)

  const fileInputFrontRef = useRef<HTMLInputElement | null>(null)
  const fileInputBackRef = useRef<HTMLInputElement | null>(null)

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

  const handleCallAPI = async (formData: FormData) => {
    try {
      console.log('Form data:', formData)

      const response = await registerAccount({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        gender: formData.gender,
        apartmentNumber: formData.apartmentNumber,
        roleName: formData.roleName
      })
      if (!response?.data) {
        throw new Error('API error: Response data is missing')
      }
      const userId = response.data
      await addOrUpdateCitizen({
        userId,
        no: formData.no,
        dateOfIssue: formData.dateOfIssue,
        dateOfExpiry: formData.dateOfExpiry,
        frontImage: formData.frontImage,
        backImage: formData.backImage
      })
      toast.success('Account created successfully!')
    } catch (error) {
      console.error('API call failed:', error)
    }
  }

  // Xử lý submit form
  const onSubmit = handleSubmit((formData) => {
    handleCallAPI(formData)
    console.log('Form Data:', formData)
    reset()
    setImagePreviewFront(null)
    setImagePreviewBack(null)
  })

  return (
    <div className='bg-[#EDF2F9] pt-25 z-13'>
      <ToastContainer />
      <div className='grid grid-cols-12 gap-5 items-start'>
        <div className='col-span-1'></div>
        <div className='col-span-2 sticky top-25'>
          <SideBarAdmin />
        </div>
        <div className='col-span-8 rounded-lg'>
          {/* <div className='text-2xl font-semibold mb-5 py-4 px-6 bg-white drop-shadow-md rounded-xl'>Add User</div> */}
          <div className='mb-6 p-6 bg-white drop-shadow-md rounded-xl'>
            <h2 className='text-xl mb-4 text-black font-semibold'>Account Information</h2>
            <form className='rounded' noValidate onSubmit={onSubmit}>
              <div className='grid grid-cols-3 gap-4'>
                <div className=''>
                  <label className='block text-sm font-semibold'>
                    Name
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <Input
                    name='fullName'
                    type='fullName'
                    register={register}
                    className='mt-1'
                    errorMessage={errors.fullName?.message}
                  />
                </div>

                <div className=''>
                  <label className='block text-sm font-semibold'>
                    Phone number
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <Input
                    name='phoneNumber'
                    type='phoneNumber'
                    register={register}
                    className='mt-1'
                    errorMessage={errors.phoneNumber?.message}
                  />
                </div>
                <div className=''>
                  <label className='block text-sm font-semibold'>
                    Email
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <Input
                    name='email'
                    type='email'
                    register={register}
                    className='mt-1'
                    errorMessage={errors.email?.message}
                  />
                </div>
              </div>
              <div className='grid grid-cols-4 gap-4'>
                <div className='mt-3'>
                  <label className='block text-sm font-semibold'>
                    Date of birth
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <Input
                    name='dateOfBirth'
                    type='date'
                    register={register}
                    className='mt-1 '
                    errorMessage={errors.dateOfBirth?.message}
                  />
                </div>
                <div className='mt-3'>
                  <label className='block text-sm font-semibold'>
                    Gender
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <select
                    {...register('gender')}
                    defaultValue='Male'
                    className='mt-1 w-full h-11 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  >
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='other'>Other</option>
                  </select>
                </div>
                <div className='mt-3'>
                  <label className='block text-sm font-semibold'>
                    Role
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <select
                    {...register('roleName')}
                    defaultValue='resident'
                    className='mt-1 w-full h-11 pl-2 cursor-pointer  outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  >
                    <option value='resident'>Resident</option>
                    <option value='manager'>Manager</option>
                  </select>
                </div>
                <div className='mt-3'>
                  <label className='block text-sm font-semibold'>
                    Apartment
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <Input
                    name='apartmentNumber'
                    type='apartmentNumber'
                    register={register}
                    className='mt-1'
                    errorMessage={errors.apartmentNumber?.message}
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
                    <Input name='no' type='no' register={register} className='mt-1' errorMessage={errors.no?.message} />
                  </div>
                  <div className=''>
                    <label className='block text-sm font-semibold'>
                      Date of issue
                      <span className='text-red-600 ml-1'>*</span>
                    </label>
                    <Input
                      name='dateOfIssue'
                      type='date'
                      register={register}
                      className='mt-1'
                      errorMessage={errors.dateOfIssue?.message}
                    />
                  </div>
                  <div className=''>
                    <label className='block text-sm font-semibold'>
                      Date of expiry
                      <span className='text-red-600 ml-1'>*</span>
                    </label>
                    <Input
                      name='dateOfExpiry'
                      type='date'
                      register={register}
                      className='mt-1'
                      errorMessage={errors.dateOfExpiry?.message}
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
                      className='mt-2 w-full h-auto p-4 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-100'
                      onClick={() => fileInputFrontRef.current?.click()}
                      onDrop={(e) => handleDrop(e, 'front')}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {imagePreviewFront ? (
                        <img src={imagePreviewFront} alt='Preview' className='w-full h-full object-cover rounded-md' />
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
                      className='mt-2 w-full h-auto p-4 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-100'
                      onClick={() => fileInputBackRef.current?.click()}
                      onDrop={(e) => handleDrop(e, 'back')}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {imagePreviewBack ? (
                        <img src={imagePreviewBack} alt='Preview' className='w-full h-full object-cover rounded-md' />
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
                <Button
                  variant='contained'
                  style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }}
                  onClick={() => {
                    reset()
                    setImagePreviewFront(null)
                    setImagePreviewBack(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  style={{ color: 'white', background: '#2976ce', fontWeight: 'semi-bold' }}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className='col-span-1'></div>
      </div>
    </div>
  )
}
