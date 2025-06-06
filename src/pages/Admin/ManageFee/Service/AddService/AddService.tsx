import { Button, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import Input from '~/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { addServiceSchema } from '~/utils/rules'
import { addService, addOrUpdateImage } from '~/apis/service.api'
import { useRef, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { toast } from 'react-toastify'
import Checkbox from '@mui/material/Checkbox'
import LoadingOverlay from '~/components/LoadingOverlay'
import { useTranslation } from 'react-i18next'

interface FormData {
  serviceName: string
  description: string
  typeOfMonth: boolean
  typeOfYear: boolean
  priceOfMonth?: number | null
  priceOfYear?: number | null
  service_Id?: string
  serviceImages: File[]
}

export default function AddService() {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(addServiceSchema)
  })

  const [typeOfMonth, setTypeOfMonth] = useState(false)
  const [typeOfYear, setTypeOfYear] = useState(false)
  const [images, setImages] = useState<string[]>([]) // Lưu trữ URL của ảnh
  const [files, setFiles] = useState<File[]>([]) // Lưu trữ danh sách file ảnh
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { t } = useTranslation('service')

  const handleDeleteImage = (index: number) => {
    // Remove image URL and file at the specified index
    setImages((prev) => prev.filter((_, i) => i !== index))
    setFiles((prev) => prev.filter((_, i) => i !== index))
    // Update form value
    setValue(
      'serviceImages',
      files.filter((_, i) => i !== index)
    )
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []) // Lấy danh sách file
    if (newFiles.length) {
      const imageUrls = newFiles.map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...imageUrls]) // Cập nhật ảnh hiển thị
      setFiles((prev) => [...prev, ...newFiles]) // Cập nhật danh sách file
      setValue('serviceImages', [...files, ...newFiles]) // Cập nhật vào form
      clearErrors('serviceImages')
    }
  }

  // Xử lý kéo & thả ảnh
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const newFiles = Array.from(event.dataTransfer.files || [])
    if (newFiles.length) {
      const imageUrls = newFiles.map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...imageUrls])
      setFiles((prev) => [...prev, ...newFiles])
      setValue('serviceImages', [...files, ...newFiles])
      clearErrors('serviceImages')
    }
  }

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

      const response = await addService({
        serviceName: formData.serviceName,
        description: formData.description,
        typeOfMonth: formData.typeOfMonth,
        typeOfYear: formData.typeOfYear,
        priceOfMonth: formData.priceOfMonth || 0,
        priceOfYear: formData.priceOfYear || 0
      })

      if (!response?.data) {
        toast.error(t('service_create_fail'))
      }

      const service_Id = response.data

      await addOrUpdateImage({
        service_Id,
        serviceImages: formData.serviceImages
      })

      toast.success(t('service_create_success'), {
        style: { width: 'fit-content' }
      })
      setImages([])
      setFiles([])
      reset()
    } catch (error) {
      console.error('API call failed:', error)
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
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && <LoadingOverlay value={progress} />}
      <form className='rounded' noValidate onSubmit={onSubmit}>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div className=''>
              <label className='block text-sm font-semibold'>
                {t('name')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <Input
                name='serviceName'
                type='serviceName'
                register={register}
                className='mt-1'
                errorMessage={errors.serviceName?.message}
              />
            </div>
            <div className='mt-2'>
              <label className='block text-sm font-semibold'>
                {t('description')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <Input
                name='description'
                type='textarea'
                register={register}
                className='mt-1'
                errorMessage={errors.description?.message}
                rows={5}
              />
            </div>
            <div className='flex gap-13 mt-4'>
              <div>
                <label className='block text-sm font-semibold'>{t('timestamp')}</label>
                <div className='flex items-center mt-2'>
                  <Checkbox
                    checked={typeOfMonth}
                    onChange={(e) => {
                      const isChecked = e.target.checked
                      setTypeOfMonth(isChecked)
                      setValue('typeOfMonth', isChecked)
                      if (!isChecked) setValue('priceOfMonth', null)
                    }}
                  />
                  <div className=''>{t('month')}</div>
                </div>
                <div className='flex items-center mt-4'>
                  <Checkbox
                    checked={typeOfYear}
                    onChange={(e) => {
                      const isChecked = e.target.checked
                      setTypeOfYear(isChecked)
                      setValue('typeOfYear', isChecked)
                      if (!isChecked) setValue('priceOfYear', null)
                    }}
                  />
                  <div className=''>{t('year')}</div>
                </div>
              </div>
              <div>
                <label className='block text-sm font-semibold'>
                  {t('price')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <div className='flex items-center mt-2 mb-5'>
                  <TextField
                    type='number'
                    disabled={!typeOfMonth}
                    variant='outlined'
                    size='small'
                    sx={{ width: '150px', backgroundColor: 'white' }}
                    {...register('priceOfMonth')}
                  />
                  <div className='mt-1 ml-4 text-xs text-red-500 min-h-4'>{errors.priceOfMonth?.message}</div>
                </div>
                <div className='flex items-center'>
                  <TextField
                    type='number'
                    disabled={!typeOfYear}
                    {...register('priceOfYear')}
                    variant='outlined'
                    size='small'
                    sx={{ width: '150px', backgroundColor: 'white' }}
                  />
                  <div className='mt-1 ml-4 text-xs text-red-500 min-h-4'>{errors.priceOfYear?.message}</div>
                </div>
              </div>
            </div>
          </div>
          <div className=''>
            <div>
              <label className='block text-sm font-semibold'>
                {t('images')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <div
                className='mt-1 w-full h-auto p-4 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-100'
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => handleDrop(e)}
                onDragOver={(e) => e.preventDefault()}
              >
                {images.length > 0 ? (
                  <div className='flex flex-wrap flex-start gap-3'>
                    {images.map((img, index) => (
                      <div key={index} className='relative group'>
                        <img
                          src={img}
                          alt='Preview'
                          className='w-auto h-24 rounded-lg object-cover shadow-lg hover:scale-105 transition-transform duration-300'
                        />
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteImage(index)
                          }}
                          className='absolute top-1 right-1 cursor-pointer bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <CloudUploadIcon className='text-gray-700 text-4xl' />
                    <p className='text-gray-700 font-semibold'>{t('upload_files')}</p>
                    <p className='text-gray-500 text-sm'>{t('drag_and_drop')}</p>
                  </>
                )}
                <input
                  type='file'
                  multiple // Cho phép chọn nhiều ảnh
                  {...register('serviceImages')}
                  accept='image/*'
                  ref={fileInputRef}
                  className='hidden'
                  onChange={handleImageChange}
                />
              </div>
              <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.serviceImages?.message}</div>
            </div>
          </div>
        </div>
        <div className='flex justify-end gap-4 mt-3'>
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
