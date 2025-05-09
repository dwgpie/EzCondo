import { Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import Input from '~/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { addUserSchema } from '~/utils/rules'
import { addOrUpdateCitizen } from '~/apis/citizen.api'
import { getApartmentByStatus } from '~/apis/apartment.api'
import { useEffect, useRef, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { toast } from 'react-toastify'
import LoadingOverlay from '~/components/LoadingOverlay'
import { registerAccount } from '~/apis/user.api'
import { useTranslation } from 'react-i18next'

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

interface Apartment {
  id: number
  apartmentNumber: string
}

export default function AddUser() {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(addUserSchema)
  })

  const [imagePreviewFront, setImagePreviewFront] = useState<string | null>(null)
  const [imagePreviewBack, setImagePreviewBack] = useState<string | null>(null)
  const fileInputFrontRef = useRef<HTMLInputElement | null>(null)
  const fileInputBackRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { t } = useTranslation('user')

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

  const [apartments, setApartments] = useState<Apartment[]>([])

  const fetchApartments = async () => {
    try {
      const response = await getApartmentByStatus()
      const sortedApartments = response.data.sort((a: Apartment, b: Apartment) =>
        a.apartmentNumber.localeCompare(b.apartmentNumber, undefined, { numeric: true })
      )
      setApartments(sortedApartments)
    } catch (error) {
      console.error('Error fetching apartments:', error)
    }
  }
  // Gọi fetch khi component mount
  useEffect(() => {
    fetchApartments()
  }, [])

  const handleCallAPI = async (formData: FormData) => {
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

      const response = await registerAccount({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        gender: formData.gender,
        apartmentNumber: formData.apartmentNumber,
        roleName: formData.roleName
      })

      const userId = response
      await addOrUpdateCitizen({
        userId,
        no: formData.no,
        dateOfIssue: formData.dateOfIssue,
        dateOfExpiry: formData.dateOfExpiry,
        frontImage: formData.frontImage,
        backImage: formData.backImage
      })

      toast.success(t('user_create_success'), {
        style: { width: 'fit-content' }
      })
    } catch (error: any) {
      toast(error.message)
    } finally {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  // Xử lý submit form
  const onSubmit = handleSubmit((formData) => {
    handleCallAPI(formData)
  })

  return (
    <div className='mx-5 mt-5 mb-5 py-3 px-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && <LoadingOverlay value={progress} />}
      <h2 className='text-xl mb-2 text-gray-500 font-semibold'>{t('account_information')}</h2>
      <form className='rounded' noValidate onSubmit={onSubmit}>
        <div className='grid grid-cols-3 gap-4'>
          <div className=''>
            <label className='block text-sm font-semibold'>
              {t('name')}
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
              {t('phone_number')}
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
              {t('email')}
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
        <div className='grid grid-cols-4 gap-4 mt-2'>
          <div className=''>
            <label className='block text-sm font-semibold'>
              {t('date_of_birth')}
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
          <div className=''>
            <label className='block text-sm font-semibold'>
              {t('gender')}
              <span className='text-red-600 ml-1'>*</span>
            </label>
            <select
              {...register('gender')}
              defaultValue='Male'
              className='mt-1 w-full h-11 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm bg-white'
            >
              <option value='male'>{t('male')}</option>
              <option value='female'>{t('female')}</option>
              <option value='other'>{t('other')}</option>
            </select>
          </div>
          <div className=''>
            <label className='block text-sm font-semibold'>
              {t('role')}
              <span className='text-red-600 ml-1'>*</span>
            </label>
            <select
              {...register('roleName')}
              defaultValue='resident'
              className='mt-1 w-full h-11 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm bg-white'
            >
              <option value='resident'>{t('resident')}</option>
              <option value='manager'>{t('manager')}</option>
            </select>
          </div>
          <div className=''>
            <label className='block text-sm font-semibold'>
              {t('apartment')}
              <span className='text-red-600 ml-1'>*</span>
            </label>
            <select
              {...register('apartmentNumber')}
              defaultValue=''
              className='mt-1 w-full h-11 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm bg-white'
              onChange={(e) => {
                setValue('apartmentNumber', e.target.value)
                clearErrors('apartmentNumber')
              }}
            >
              <option value='' disabled hidden></option>
              {apartments.map((apt) => (
                <option key={apt.id} value={apt.apartmentNumber}>
                  {apt.apartmentNumber}
                </option>
              ))}
            </select>
            <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.apartmentNumber?.message}</div>
          </div>
        </div>

        <div className='mt-3'>
          <h3 className='text-lg mb-2 font-semibold text-gray-500'>{t('citizen_identity_number')}</h3>
          <div className='flex justify-between'>
            <div className='w-[30%]'>
              <div className=''>
                <label className='block text-sm font-semibold'>
                  {t('no')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <Input name='no' type='no' register={register} className='mt-1' errorMessage={errors.no?.message} />
              </div>
              <div className='mt-2'>
                <label className='block text-sm font-semibold'>
                  {t('date_of_issue')}
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
              <div className='mt-2'>
                <label className='block text-sm font-semibold'>
                  {t('date_of_expiry')}
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
            <div className='w-[65%]'>
              <div className='flex justify-between'>
                <div className='w-[47%]'>
                  <label className='block text-sm font-semibold'>
                    {t('front_image')}
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <div
                    className='mt-2 w-full h-auto p-4 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-100'
                    onClick={() => fileInputFrontRef.current?.click()}
                    onDrop={(e) => handleDrop(e, 'front')}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {imagePreviewFront ? (
                      <img
                        src={imagePreviewFront}
                        alt='Preview'
                        className='w-full h-full object-cover rounded-md hover:scale-105 transition-transform duration-300'
                      />
                    ) : (
                      <>
                        <CloudUploadIcon className='text-gray-700 text-4xl' />
                        <p className='text-gray-700 font-semibold'>{t('upload_file')}</p>
                        <p className='text-gray-500 text-sm'>{t('drag_and_drop')}</p>
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
                <div className='w-[47%]'>
                  <div>
                    <label className='block text-sm font-semibold'>
                      {t('back_image')}
                      <span className='text-red-600 ml-1'>*</span>
                    </label>
                    <div
                      className='mt-2 w-full h-auto p-4 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-100'
                      onClick={() => fileInputBackRef.current?.click()}
                      onDrop={(e) => handleDrop(e, 'back')}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {imagePreviewBack ? (
                        <img
                          src={imagePreviewBack}
                          alt='Preview'
                          className='w-full h-full object-cover rounded-md hover:scale-105 transition-transform duration-300'
                        />
                      ) : (
                        <>
                          <CloudUploadIcon className='text-gray-700 text-4xl' />
                          <p className='text-gray-700 font-semibold'>{t('upload_file')}</p>
                          <p className='text-gray-500 text-sm'>{t('drag_and_drop')}</p>
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
            </div>
          </div>
        </div>
        <div className='flex justify-end gap-4 mt-[-13px]'>
          <Button
            type='submit'
            variant='contained'
            style={{ color: 'white', background: '#2976ce', fontWeight: 'semi-bold' }}
          >
            {t('submit')}
          </Button>
        </div>
      </form>
    </div>
  )
}
