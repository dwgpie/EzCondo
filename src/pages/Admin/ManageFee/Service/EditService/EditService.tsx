import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { getServiceById, editService, addOrUpdateImage, getImageById } from '~/apis/service.api'
import { serviceSchema } from '~/utils/rules'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRef } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { ToastContainer, toast } from 'react-toastify'
import { Button, Checkbox, TextField } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import InputEdit from '~/components/InputEdit'

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

  const [images, setImages] = useState<string[]>([]) // Lưu trữ URL của ảnh
  const [files, setFiles] = useState<File[]>([]) // Lưu trữ danh sách file ảnh
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [service, setService] = useState<formData | null>(null)

  const handleDeleteImage = (index: number) => {
    // Remove image URL and file at the specified index
    setFiles((prev) => prev.filter((_, i) => i !== index))
    // Update form value
    setValue(
      'serviceImages',
      files.filter((_, i) => i !== index)
    )
    console.log(files)
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []) // Lấy danh sách file
    if (newFiles.length) {
      setFiles((prev) => [...prev, ...newFiles]) // Cập nhật danh sách file
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

      clearErrors('serviceImages')
    }
  }

  const getServiceIdFromURL = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('serviceId') // Đảm bảo đúng với cách truyền userId
  }

  const serviceId = getServiceIdFromURL()

  const getImageSrc = (image: string | File | null | undefined) => {
    if (image instanceof File) {
      return URL.createObjectURL(image)
    } // fix
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
      setService(data) // Cập nhật state với dữ liệu từ API
      console.log(data)

      // Xử lý ảnh cũ nếu có
      if (data.serviceImages?.length) {
        // Định nghĩa kiểu dữ liệu cho img
        const imageUrls = data.serviceImages.map((img: { imgPath: string }) => img.imgPath)
        setImages(imageUrls) // Chỉ lưu imgPath
        console.log('url ảnh: ', imageUrls)

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
  }, [serviceId])

  const onSubmit = handleSubmit(async (formData) => {
    try {
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
      console.log(formData)
      await addOrUpdateImage({
        service_Id: serviceId ?? '',
        serviceImages: files
      })
      toast.success('Service updated successfully!')
      setImages([])
      setFiles([])
    } catch (error) {
      console.error('API call failed:', error)
    }
  })

  return (
    <div style={{ height: 'calc(100vh - 80px)' }} className='pt-5 ml-5 mr-5 z-13 h-screen'>
      <ToastContainer />
      <div className='mb-6 p-6 bg-white drop-shadow-md rounded-xl'>
        {service ? (
          <form className='rounded' noValidate onSubmit={onSubmit}>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className=''>
                  <label className='block text-sm font-semibold'>
                    Name
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
                <div className='mt-5'>
                  <label className='block text-sm font-semibold'>
                    Description
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <InputEdit
                    name='description'
                    type='text'
                    className='mt-1'
                    errorMessage={errors.description?.message}
                    defaultValue={service.description}
                    register={register}
                  />
                </div>
                <div className='mt-5'>
                  <label className='block text-sm font-semibold'>
                    Status
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <InputEdit
                    name='status'
                    type='text'
                    className='mt-1'
                    errorMessage={errors.status?.message}
                    defaultValue={service.status}
                    register={register}
                  />
                </div>
                <div className='flex mt-6'>
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
                        {...register('typeOfMonth')}
                        checked={watch('typeOfMonth', service.typeOfMonth)}
                        onChange={(e) => {
                          setValue('typeOfMonth', e.target.checked)
                          if (!e.target.checked) {
                            setValue('priceOfMonth', 0)
                          }
                        }}
                      />
                      <div className='mr-10'>Month</div>
                      <TextField
                        type='number'
                        disabled={!watch('typeOfMonth', service.typeOfMonth)}
                        {...register('priceOfMonth', { valueAsNumber: true })}
                        variant='outlined'
                        size='small'
                        sx={{ width: '150px' }}
                        defaultValue={service.priceOfMonth}
                      />
                      <div className='mt-1 ml-3 text-xs text-red-500 min-h-4'>{errors.priceOfMonth?.message}</div>
                    </div>
                    <div className='flex items-center mt-2'>
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
                      <div className='mr-[54px]'>Year</div>
                      <TextField
                        type='number'
                        disabled={!watch('typeOfYear', service.typeOfYear)}
                        {...register('priceOfYear', { valueAsNumber: true })}
                        variant='outlined'
                        size='small'
                        sx={{ width: '150px' }}
                        defaultValue={service.priceOfYear}
                      />
                      <div className='mt-1 ml-3 text-xs text-red-500 min-h-4'>{errors.priceOfYear?.message}</div>
                    </div>
                  </div>
                </div>
              </div>
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
                  {files.length > 0 ? (
                    <div className='flex flex-wrap flex-start gap-10'>
                      {files.map((imgPath, index) => (
                        <div key={index} className='relative group'>
                          <img src={getImageSrc(imgPath)} alt='Preview' className='w-24 h-24 object-fit rounded-md' />
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
                <Button
                  variant='contained'
                  style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }}
                  // onClick={() => navigate(-1)}
                >
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
          <p>Đang tải dữ liệu...</p>
        )}
      </div>
    </div>
  )
}
