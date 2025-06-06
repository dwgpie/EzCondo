import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { getServiceById, editService, addOrUpdateImage, getImageById } from '~/apis/service.api'
import { serviceSchema } from '~/utils/rules'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRef } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { toast } from 'react-toastify'
import { Button, Checkbox, TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import InputEdit from '~/components/InputEdit'
import LoadingOverlay from '~/components/LoadingOverlay'
import { useTranslation } from 'react-i18next'

interface formData {
  id?: string
  status: string
  serviceName: string
  description: string
  typeOfMonth: boolean
  typeOfYear: boolean
  priceOfMonth?: number | null
  priceOfYear?: number | null
  service_Id?: string
  serviceImages: File[]
}

export default function EditService() {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors }
  } = useForm<formData>({
    resolver: yupResolver(serviceSchema)
  })

  const [, setImages] = useState<string[]>([]) // Lưu trữ URL của ảnh
  const [files, setFiles] = useState<File[]>([]) // Lưu trữ danh sách file ảnh
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [service, setService] = useState<formData | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { t } = useTranslation('service')

  const handleDeleteImage = (index: number) => {
    // Remove image URL and file at the specified index
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
      setFiles((prev) => [...prev, ...newFiles]) // Cập nhật danh sách file
      setValue('serviceImages', [...files, ...newFiles])
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

  const getServiceIdFromURL = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('serviceId')
  }

  const serviceId = getServiceIdFromURL()

  const getImageSrc = (image: string | File | null | undefined) => {
    if (image instanceof File) {
      return URL.createObjectURL(image)
    }
    return image || undefined
  }

  const getServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const [serviceResponse, imageResponse] = await Promise.all([getServiceById(id), getImageById(id)])
      return {
        ...serviceResponse.data, // Dữ liệu từ service
        serviceImages: imageResponse.data // Thêm ảnh vào object
      }
    },
    onSuccess: async (data) => {
      setService(data)

      // Xử lý ảnh cũ nếu có
      if (data.serviceImages?.length) {
        // Định nghĩa kiểu dữ liệu cho img
        const imageUrls = data.serviceImages.map((img: { imgPath: string }) => img.imgPath)
        setImages(imageUrls) // Chỉ lưu imgPath

        // Chuyển URL ảnh thành File giả lập
        const parseFiles = await Promise.all(
          imageUrls.map(async (url: string) => {
            const response = await fetch(url)
            const blob = await response.blob()
            return new File([blob], `image-${Date.now()}.jpg`, { type: blob.type })
          })
        )
        setFiles(parseFiles)
        setValue('serviceImages', parseFiles)
        // console.log('file ảnh: ', files)
      }
    },
    onError: (error) => {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error)
    }
  })

  useEffect(() => {
    if (serviceId) {
      getServiceMutation.mutate(serviceId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId])

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

      await editService({
        id: serviceId ?? '',
        status: formData.status,
        serviceName: formData.serviceName,
        description: formData.description,
        typeOfMonth: formData.typeOfMonth,
        typeOfYear: formData.typeOfYear,
        priceOfMonth: formData.priceOfMonth || 0,
        priceOfYear: formData.priceOfYear || 0
      })
      await addOrUpdateImage({
        service_Id: serviceId ?? '',
        serviceImages: files
      })
      setImages([])
      setFiles([])
      toast.success(t('service_update_success'), {
        style: { width: 'fit-content' }
      })
      setTimeout(() => {
        window.location.href = '/admin/list-service'
      }, 1500)
    } catch (error) {
      console.error('API call failed:', error)
    } finally {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  })

  return (
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && <LoadingOverlay value={progress} />}
      {service ? (
        <form className='rounded' noValidate onSubmit={onSubmit}>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <div className=''>
                <label className='block text-sm font-semibold'>
                  {t('name')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <InputEdit
                  name='serviceName'
                  type='text'
                  className='mt-1'
                  errorMessage={errors.serviceName?.message}
                  defaultValue={service.serviceName}
                  register={register}
                />
              </div>
              <div className=''>
                <label className='block text-sm font-semibold mb-1'>
                  {t('description')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <InputEdit
                  name='description'
                  type='textarea'
                  className='mt-1'
                  errorMessage={errors.description?.message}
                  defaultValue={service.description}
                  register={register}
                  rows={5}
                />
              </div>
              <div className=''>
                <label className='block text-sm font-semibold'>
                  {t('status')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <select
                  {...register('status')}
                  defaultValue={service.status}
                  className='mt-1 w-full py-4 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                >
                  <option value='active'>{t('active')}</option>
                  <option value='inactive'>{t('inactive')}</option>
                </select>
              </div>
              <div className='flex gap-13 mt-4'>
                <div>
                  <label className='block text-sm font-semibold'>{t('timestamp')}</label>
                  <div className='flex items-center mt-2'>
                    <Checkbox
                      {...register('typeOfMonth')}
                      checked={watch('typeOfMonth', service.typeOfMonth)}
                      onChange={(e) => {
                        setValue('typeOfMonth', e.target.checked)
                        if (!e.target.checked) {
                          setValue('priceOfMonth', 0)
                        }
                      }}
                    />
                    <div className=''>{t('month')}</div>
                  </div>
                  <div className='flex items-center mt-4'>
                    <Checkbox
                      {...register('typeOfYear')}
                      checked={watch('typeOfYear', service.typeOfYear)}
                      onChange={(e) => {
                        const isChecked = e.target.checked
                        setValue('typeOfYear', isChecked)
                        if (!isChecked) {
                          setValue('priceOfYear', 0) // Reset về 0 khi bỏ chọn
                        }
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
                      disabled={!watch('typeOfMonth', service.typeOfMonth)}
                      {...register('priceOfMonth', { valueAsNumber: true })}
                      variant='outlined'
                      size='small'
                      sx={{ width: '150px' }}
                      defaultValue={service.priceOfMonth}
                    />
                    <div className='mt-1 ml-4 text-xs text-red-500 min-h-4'>{errors.priceOfMonth?.message}</div>
                  </div>
                  <div className='flex items-center'>
                    <TextField
                      type='number'
                      disabled={!watch('typeOfYear', service.typeOfYear)}
                      {...register('priceOfYear', { valueAsNumber: true })}
                      variant='outlined'
                      size='small'
                      sx={{ width: '150px' }}
                      defaultValue={service.priceOfYear}
                    />
                    <div className='mt-1 ml-4 text-xs text-red-500 min-h-4'>{errors.priceOfYear?.message}</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className='block text-sm font-semibold'>
                {t('images')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <div
                className='mt-1 w-full h-auto p-4 border-2 border-dashed border-blue-400 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-100'
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => handleDrop(e)}
                onDragOver={(e) => e.preventDefault()}
              >
                {files.length > 0 ? (
                  <div className='flex flex-wrap flex-start gap-10'>
                    {files.map((imgPath, index) => (
                      <div key={index} className='relative group'>
                        <img
                          src={getImageSrc(imgPath)}
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
          <div className='flex justify-end gap-4 mt-3'>
            <Link to='/admin/list-service'>
              <Button variant='contained' style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }}>
                {t('cancel')}
              </Button>
            </Link>
            <Button
              type='submit'
              variant='contained'
              style={{ color: 'white', background: '#2976ce', fontWeight: 'semi-bold' }}
            >
              {t('submit_save')}
            </Button>
          </div>
        </form>
      ) : (
        <p>{t('loading_data')}</p>
      )}
    </div>
  )
}
