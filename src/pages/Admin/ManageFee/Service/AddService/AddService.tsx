import { Button, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import Input from '~/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { addServiceSchema } from '~/utils/rules'
import { addService, addOrUpdateImage } from '~/apis/service.api'
import { useRef, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { ToastContainer, toast } from 'react-toastify'
import Checkbox from '@mui/material/Checkbox'
import { useNavigate } from 'react-router-dom'
import LoadingOverlay from '~/components/LoadingOverlay'

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

  const navigate = useNavigate()
  const [typeOfMonth, setTypeOfMonth] = useState(false)
  const [typeOfYear, setTypeOfYear] = useState(false)
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
          return prev + 5
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
        toast.error('Failed to create service')
      }

      const service_Id = response.data
      console.log('Service ID:', service_Id)

      await addOrUpdateImage({
        service_Id,
        serviceImages: formData.serviceImages
      })

      toast.success('Service created successfully!', {
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
    <div className='pt-5 mx-5 z-13' style={{ height: 'calc(100vh - 80px)' }}>
      <ToastContainer />
      <div className='mb-6 p-6 bg-gradient-to-br from-white via-white to-blue-100 shadow-xl rounded-2xl space-y-6'>
        {loading && <LoadingOverlay value={progress} />}
        <form className='rounded' noValidate onSubmit={onSubmit}>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <div className=''>
                <label className='block text-sm font-semibold'>
                  Name
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
              <div className=''>
                <label className='block text-sm font-semibold'>
                  Description
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
              <div className='flex'>
                <div>
                  <div className='flex items-center gap-11'>
                    <label className='block text-sm font-semibold'>Timestamp</label>
                    <label className='block text-sm font-semibold ml-3'>
                      Price
                      <span className='text-red-600 ml-1'>*</span>
                    </label>
                  </div>
                  <div className='flex items-center justify-center mt-2'>
                    <Checkbox
                      checked={typeOfMonth}
                      onChange={(e) => {
                        const isChecked = e.target.checked
                        setTypeOfMonth(isChecked)
                        setValue('typeOfMonth', isChecked)
                        if (!isChecked) {
                          setValue('priceOfMonth', null) // Reset nếu bỏ chọn
                        }
                      }}
                    />
                    <div className='mr-10'>Month</div>
                    <TextField
                      type='number'
                      disabled={!typeOfMonth}
                      variant='outlined'
                      size='small'
                      sx={{ width: '150px' }}
                      {...register('priceOfMonth')}
                    />
                    <div className='mt-1 ml-3 text-xs text-red-500 min-h-4'>{errors.priceOfMonth?.message}</div>
                  </div>
                  <div className='flex items-center mt-2'>
                    <Checkbox
                      checked={typeOfYear}
                      onChange={(e) => {
                        const isChecked = e.target.checked
                        setTypeOfYear(isChecked)
                        setValue('typeOfYear', isChecked)
                        if (!isChecked) {
                          setValue('priceOfYear', null) // Đặt lại giá trị
                        }
                      }}
                    />
                    <div className='mr-[54px]'>Year</div>
                    <TextField
                      type='number'
                      disabled={!typeOfYear}
                      {...register('priceOfYear')}
                      variant='outlined'
                      size='small'
                      sx={{ width: '150px' }}
                    />
                    <div className='mt-1 ml-3 text-xs text-red-500 min-h-4'>{errors.priceOfYear?.message}</div>
                  </div>
                </div>
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
