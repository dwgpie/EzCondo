import { Button, MenuItem, Select } from '@mui/material'
import { useForm } from 'react-hook-form'
import Input from '~/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { notificationSchema } from '~/utils/rules'
import { addNotification, addNotificationImages } from '~/apis/notification.api'
import { useRef, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import LoadingOverlay from '~/components/LoadingOverlay'

interface FormData {
  title: string
  content: string
  receiver: string
  type: string
  NotificationId?: string
  Image: File[]
}

export default function AddNotification() {
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

  const navigate = useNavigate()
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
          return prev + 10
        })
      }, 300)

      const response = await addNotification({
        title: formData.title,
        content: formData.content,
        receiver: formData.receiver,
        type: formData.type
      })

      if (!response?.data) {
        toast.error('Failed to create service')
      }

      const NotificationId = response.data
      console.log('ID:', NotificationId)

      await addNotificationImages({
        NotificationId,
        Image: formData.Image
      })

      toast.success('Notification created successfully!')
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
    <div className='pt-5 mx-5 z-13'>
      <ToastContainer />
      <div className='mb-6 p-6 bg-white drop-shadow-md rounded-xl'>
        {loading && <LoadingOverlay value={progress} />}
        <form className='rounded' noValidate onSubmit={onSubmit}>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-semibold mb-[6px]'>
                    Receiver
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <Select
                    id='demo-select-small'
                    defaultValue='manager'
                    {...register('receiver')}
                    sx={{ width: '200px' }}
                  >
                    <MenuItem value='manager'>Manager</MenuItem>
                    <MenuItem value='resident'>Resident</MenuItem>
                    <MenuItem value='all'>All</MenuItem>
                  </Select>
                </div>
                <div>
                  <label className='block text-sm font-semibold mb-[6px]'>
                    Type
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <Select id='demo-select-small' defaultValue='news' {...register('type')} sx={{ width: '200px' }}>
                    <MenuItem value='news'>News</MenuItem>
                    <MenuItem value='notice'>Notice</MenuItem>
                    <MenuItem value='fees'>Fee</MenuItem>
                  </Select>
                </div>
              </div>
              <div className=''>
                <label className='block text-sm font-semibold'>
                  Title
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
                  Content
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
                <label className='block text-sm font-semibold'>
                  Images
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <div
                  className='mt-1 w-full h-auto p-4 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-100'
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={(e) => handleDrop(e)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {images.length > 0 ? (
                    <div className='flex flex-wrap flex-start gap-10'>
                      {images.map((img, index) => (
                        <div key={index} className='relative group'>
                          <img src={img} alt='Preview' className='w-24 h-24 object-fit rounded-md' />
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
                      <p className='text-gray-700 font-semibold'>Upload Files</p>
                      <p className='text-gray-500 text-sm'>Drag and drop files here</p>
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
                <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.Image?.message}</div>
              </div>
            </div>
          </div>
          <div className='flex justify-end gap-4 mt-3'>
            <Button
              variant='contained'
              style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }}
              onClick={() => navigate(-1)}
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
  )
}
