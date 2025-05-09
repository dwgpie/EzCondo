import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  MenuItem,
  RadioGroup,
  Select,
  Autocomplete,
  TextField
} from '@mui/material'
import { useForm } from 'react-hook-form'
import Input from '~/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { notificationSchemaManager } from '~/utils/rules'
import { addNotification, addNotificationToResident, addNotificationImages } from '~/apis/notification.api'
import { getApartmentByStatusTrue } from '~/apis/apartment.api'
import { useEffect, useRef, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { toast } from 'react-toastify'
import { useNavigate, useLocation } from 'react-router-dom'
import LoadingOverlay from '~/components/LoadingOverlay'
import { useTranslation } from 'react-i18next'

interface FormData {
  title: string
  content: string
  type: string
  receiver?: string
  apartmentNumber?: string
  NotificationId?: string
  Image: File[]
}

interface Apartment {
  id: number
  apartmentNumber: string
}

export default function AddNotificationManager() {
  const { t } = useTranslation('notification')
  const location = useLocation()
  const preSelectedApartments = location.state?.selectedApartments || []

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(notificationSchemaManager)
  })

  const navigate = useNavigate()
  const [images, setImages] = useState<string[]>([]) // Lưu trữ URL của ảnh
  const [files, setFiles] = useState<File[]>([]) // Lưu trữ danh sách file ảnh
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const [apartments, setApartments] = useState<Apartment[]>([])
  const [apartmentChoosed, setApartmentChoosed] = useState<string[]>([])
  const [radio, setRadio] = useState(preSelectedApartments.length > 0 ? 'apartment' : 'resident')

  const fetchApartments = async () => {
    try {
      const response = await getApartmentByStatusTrue()
      const sortedApartments = response.data.sort((a: Apartment, b: Apartment) =>
        a.apartmentNumber.localeCompare(b.apartmentNumber, undefined, { numeric: true })
      )
      setApartments(sortedApartments)
    } catch (error) {
      console.error('Error fetching apartments:', error)
    }
  }

  useEffect(() => {
    if (location.state) {
      const { selectedApartments, title, content } = location.state
      if (selectedApartments?.length > 0) {
        setValue('receiver', 'apartment')
        setApartmentChoosed(selectedApartments)
        setValue('apartmentNumber', selectedApartments.join(', '))
      } else {
        setValue('receiver', 'resident')
      }

      if (title) {
        setValue('title', title)
      }
      if (content) {
        setValue('content', content)
      }
    }
    fetchApartments()
  }, [])

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

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setRadio(value)
    setValue('receiver', value)

    // if (value === 'resident') {
    //   setValue('apartmentNumber', '')
    // } else {
    //   setValue('receiver', '')
    // }
  }

  const handleCallAPI1 = async (formData: FormData) => {
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

      const response = await addNotification({
        title: formData.title,
        content: formData.content,
        receiver: 'resident',
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

  const handleCallAPI2 = async (formData: any) => {
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

      // Gửi data
      const notificationData = apartmentChoosed.map((apartmentNumber) => ({
        title: formData.title,
        content: formData.content,
        type: formData.type,
        apartmentNumber: apartmentNumber
      }))

      const response = await addNotificationToResident(notificationData)

      if (!response?.data) {
        toast.error('Failed to create notification')
        return
      }

      const NotificationId = response.data

      // Gửi ảnh nếu có
      for (const id of NotificationId) {
        await addNotificationImages({
          NotificationId: id,
          Image: formData.Image
        })
      }

      toast.success('Notification created successfully!', {
        style: { width: 'fit-content' }
      })

      setImages([])
      setFiles([])

      // Giai đoạn 2: từ 90 -> 100 trong 300ms
      const start = performance.now()
      const duration = 300

      const animateTo100 = (timestamp: number) => {
        const elapsed = timestamp - start
        const t = Math.min(elapsed / duration, 1)
        const eased = 90 + t * 10
        setProgress(eased)

        if (t < 1) {
          requestAnimationFrame(animateTo100)
        } else {
          setTimeout(() => {
            setLoading(false)
          }, 200) // Cho hiệu ứng tự nhiên thêm một chút
        }
      }

      requestAnimationFrame(animateTo100)
    } catch (error) {
      console.error('API call failed:', error)
      // Nếu lỗi xảy ra, vẫn cho progress chạy nốt đến 100
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  // Xử lý submit form
  const onSubmit = handleSubmit((formData) => {
    console.log(formData)

    if (radio === 'resident') {
      handleCallAPI1(formData)
      console.log('gửi toàn bộ')
    } else if (radio === 'apartment') {
      handleCallAPI2(formData)
      console.log('gửi apartment')
    }
    reset()
  })

  return (
    <div className='mx-5 mt-5 mb-5 p-6 z-13 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl relative'>
      {loading && (
        <div className='absolute inset-0 z-50 bg-white bg-opacity-50 flex justify-center items-center'>
          <LoadingOverlay value={progress} />
        </div>
      )}
      <form className='rounded' noValidate onSubmit={onSubmit}>
        <div className='grid grid-cols-2 gap-4'>
          <div className='col-span-1'>
            <div className='flex justify-between'>
              <FormControl>
                <FormLabel
                  sx={{ color: '#000', fontWeight: '500', fontSize: '16px', marginBottom: '1px' }}
                  id='demo-radio-buttons-group-label'
                >
                  {t('receiver')}
                  <span className='text-red-600 ml-1'>*</span>
                </FormLabel>

                <RadioGroup
                  aria-labelledby='demo-radio-buttons-group-label'
                  value={radio}
                  name='radio-buttons-group'
                  onChange={handleChangeRadio}
                >
                  <FormControlLabel value='resident' control={<Radio />} label={t('resident')} />
                  <FormControlLabel value='apartment' control={<Radio />} label={t('apartment')} />
                </RadioGroup>
              </FormControl>
              <div className='mr-18'>
                <label className='block text-sm font-semibold mb-[6px]'>
                  {t('type')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <Select
                  id='demo-select-small'
                  defaultValue='new'
                  {...register('type')}
                  sx={{ width: '200px', height: '55px', backgroundColor: 'white' }}
                >
                  <MenuItem value='new'>{t('new')}</MenuItem>
                  <MenuItem value='notice'>{t('notice')}</MenuItem>
                  <MenuItem value='fee'>{t('fee')}</MenuItem>
                </Select>
              </div>
            </div>
            <div className='mt-10'>
              <div className=''>
                <div className=''>
                  <label className='block text-sm font-semibold mt-4'>
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
                  <label className='block text-sm font-semibold mt-3'>
                    {t('content')}
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <Input
                    name='content'
                    type='textarea'
                    register={register}
                    className='mt-1'
                    errorMessage={errors.content?.message}
                    rows={7}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='col-span-1'>
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
                {...register('Image')}
                accept='image/*'
                ref={fileInputRef}
                className='hidden'
                onChange={handleImageChange}
              />
            </div>
            <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.Image?.message}</div>
            <div
              className={` transition-all duration-300
                  ${radio === 'resident' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <label className='block text-sm font-semibold mb-[6px]'>
                {t('apartment')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <Autocomplete
                multiple
                options={apartments.map((apt) => apt.apartmentNumber)}
                onChange={(_, newValue) => {
                  setApartmentChoosed(newValue)
                  setValue('apartmentNumber', newValue.join(', '))
                  clearErrors('apartmentNumber')
                }}
                value={apartmentChoosed}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('search_apartment')}
                    variant='outlined'
                    sx={{ backgroundColor: 'white' }}
                  />
                )}
              />

              <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.apartmentNumber?.message}</div>
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-4 mt-3'>
          <Button
            variant='contained'
            style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }}
            onClick={() => navigate(-1)}
          >
            {t('cancel')}
          </Button>
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
