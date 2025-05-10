import { Button, MenuItem, Select } from '@mui/material'
import { useForm } from 'react-hook-form'
import Input from '~/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { notificationSchema } from '~/utils/rules'
import { addNotification, addNotificationImages } from '~/apis/notification.api'
import { useRef, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { toast } from 'react-toastify'
import LoadingOverlay from '~/components/LoadingOverlay'
import { useTranslation } from 'react-i18next'

interface FormData {
  title: string
  content: string
  receiver: string
  type: string
  NotificationId?: string
  Image?: (File | undefined)[]
}

export default function AddNotification() {
  const { t } = useTranslation('notification')
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(notificationSchema)
  })

  const [images, setImages] = useState<string[]>([]) // Lưu trữ URL của ảnh
  const [files, setFiles] = useState<File[]>([]) // Lưu trữ danh sách file ảnh
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDeleteImage = (index: number) => {
    // Remove image URL and file at the specified index
    setImages((prev) => prev.filter((_, i) => i !== index))
    setFiles((prev) => prev.filter((_, i) => i !== index))
    // Update form value
    setValue(
      'Image',
      files.filter((_, i) => i !== index)
    )
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []) // Lấy danh sách file
    if (newFiles.length) {
      const imageUrls = newFiles.map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...imageUrls]) // Cập nhật ảnh hiển thị
      setFiles((prev) => [...prev, ...newFiles]) // Cập nhật danh sách file
      setValue('Image', [...files, ...newFiles]) // Cập nhật vào form
      clearErrors('Image')
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
      setValue('Image', [...files, ...newFiles])
      clearErrors('Image')
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
          return prev + 4
        })
      }, 150)

      const response = await addNotification({
        title: formData.title,
        content: formData.content,
        receiver: formData.receiver,
        type: formData.type
      })

      if (!response?.data) {
        toast.error(t('create_service_failed'), {
          style: { width: 'fit-content' }
        })
      }

      const NotificationId = response.data
      console.log('ID:', NotificationId)

      const validImages = (formData.Image ?? []).filter((f): f is File => !!f)

      if (validImages.length > 0) {
        await addNotificationImages({
          NotificationId,
          Image: validImages
        })
      }

      toast.success(t('notification_create_success'), {
        style: { width: 'fit-content' }
      })
      setImages([])
      setFiles([])
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
    reset()
  })

  return (
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && <LoadingOverlay value={progress} />}
      <form className='rounded' noValidate onSubmit={onSubmit}>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div className='grid grid-cols-2 gap-4 mb-4'>
              <div>
                <label className='block text-sm font-semibold mb-[6px]'>
                  {t('receiver')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <Select id='demo-select-small' defaultValue='manager' {...register('receiver')} sx={{ width: '200px' }}>
                  <MenuItem value='manager'>{t('manager')}</MenuItem>
                  <MenuItem value='resident'>{t('resident')}</MenuItem>
                  <MenuItem value='all'>{t('all')}</MenuItem>
                </Select>
              </div>
              <div>
                <label className='block text-sm font-semibold mb-[6px]'>
                  {t('type')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <Select id='demo-select-small' defaultValue='new' {...register('type')} sx={{ width: '200px' }}>
                  <MenuItem value='new'>{t('new')}</MenuItem>
                  <MenuItem value='notice'>{t('notice')}</MenuItem>
                  <MenuItem value='fee'>{t('fee')}</MenuItem>
                </Select>
              </div>
            </div>
            <div className='mb-3'>
              <label className='block text-sm font-semibold'>
                {t('title')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <Input
                name='title'
                type='textarea'
                register={register}
                className='mt-1'
                errorMessage={errors.title?.message}
                rows={2}
              />
            </div>
            <div className=''>
              <label className='block text-sm font-semibold'>
                {t('content')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <Input
                name='content'
                type='textarea'
                register={register}
                className='mt-1'
                errorMessage={errors.content?.message}
                rows={4}
              />
            </div>
          </div>
          <div className=''>
            <div>
              <label className='block text-sm font-semibold'>{t('images')}</label>
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
                          alt={t('preview')}
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
                  {...register('Image')}
                  accept='image/*'
                  ref={fileInputRef}
                  className='hidden'
                  onChange={handleImageChange}
                />
              </div>
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
