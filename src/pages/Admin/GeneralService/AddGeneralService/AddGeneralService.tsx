import { Button, TextField, Slider } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { otherServiceSchema } from '~/utils/rules'
import { addOtherService } from '~/apis/service.api'
import { useState } from 'react'
import { toast } from 'react-toastify'
import LoadingOverlay from '~/components/LoadingOverlay'
import { useTranslation } from 'react-i18next'

interface FormData {
  id?: string
  name: string
  price: number
  description: string
}

export default function AddGeneralService() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(otherServiceSchema),
    defaultValues: {
      price: 0
    }
  })

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { t } = useTranslation('service')

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

      await addOtherService({
        name: formData.name,
        price: formData.price,
        description: formData.description
      })

      toast.success(t('service_create_success'), {
        style: { width: 'fit-content' }
      })
    } catch (error) {
      console.error('API call failed:', error)
    } finally {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  const price = watch('price')

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) {
      setValue('price', newValue)
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
          <div className='grid grid-cols-1 gap-4'>
            <div className=''>
              <label className='block text-sm font-semibold mb-1'>
                {t('name')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <TextField type='text' {...register('name')} sx={{ backgroundColor: 'white', width: '450px' }} />
              <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.name?.message}</div>
            </div>
            <div className='mt-2'>
              <label className='block text-sm font-semibold mb-1'>
                {t('description')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <TextField
                type='text'
                {...register('description')}
                sx={{ backgroundColor: 'white', width: '450px' }}
                multiline
                rows={4}
              />
              <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.description?.message}</div>
            </div>
          </div>
          <div className=''>
            <label className='block text-sm font-semibold mb-1'>
              {t('price')}
              <span className='text-red-600 ml-1'>*</span>
            </label>
            <div className='w-full mt-10 px-5'>
              <Slider
                value={price}
                onChange={handleSliderChange}
                valueLabelDisplay='on'
                valueLabelFormat={(value) => `${value} VND`}
                min={0}
                max={200000}
                marks={[
                  { value: 0, label: '0' },
                  { value: 25000, label: '25K' },
                  { value: 50000, label: '50K' },
                  { value: 75000, label: '75K' },
                  { value: 100000, label: '100K' },
                  { value: 125000, label: '125K' },
                  { value: 150000, label: '150K' },
                  { value: 175000, label: '175K' },
                  { value: 200000, label: '200K' }
                ]}
                sx={{
                  '& .MuiSlider-valueLabel': {
                    backgroundColor: 'transparent',
                    color: '#1976d2',
                    fontWeight: 'bold'
                  }
                }}
              />
              <div className='flex justify-between gap-2.5 mt-3'>
                <div>
                  <TextField
                    type='number'
                    {...register('price')}
                    onChange={(e) => setValue('price', Number(e.target.value))}
                    sx={{ backgroundColor: 'white' }}
                  />
                  <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.price?.message}</div>
                </div>
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
