import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { Button, MenuItem, Select, TextField, SelectChangeEvent } from '@mui/material'
import Input from '~/components/Input'
import LoadingOverlay from '~/components/LoadingOverlay'
import { addApartment } from '~/apis/apartment.api'
import { AddApartmentSchema, apartmentSchema } from '~/utils/rules'
import { useTranslation } from 'react-i18next'

type FormData = AddApartmentSchema

export default function AddApartment() {
  const { t } = useTranslation('apartment')
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(apartmentSchema)
  })

  const [roomNumber, setRoomNumber] = useState('')
  const [floor, setFloor] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleRoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomNumber(event.target.value)
  }

  const handleFloorChange = (event: SelectChangeEvent<string>) => {
    setFloor(event.target.value)
  }

  useEffect(() => {
    if (roomNumber && floor) {
      setValue('apartmentNumber', `${floor}${roomNumber}`)
    }
  }, [roomNumber, floor, setValue])

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

      await addApartment({
        apartmentNumber: formData.apartmentNumber,
        acreage: formData.acreage,
        description: formData.description
      })

      toast.success(t('add_apartment_success'), {
        style: { width: 'fit-content' }
      })
    } catch (error) {
      const err = error as Error
      toast.error(t(err.message), {
        style: { width: 'fit-content' }
      })
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
        <div className='grid grid-cols-4 gap-4'>
          <div>
            <label className='block text-sm font-semibold'>
              {t('room_code')}
              <span className='text-red-600 ml-1'>*</span>
            </label>
            <TextField
              type='number'
              value={roomNumber}
              onChange={handleRoomChange}
              sx={{ width: '200px', marginTop: '6px', backgroundColor: 'white' }}
            />
          </div>
          <div>
            <label className='block text-sm font-semibold mb-[6px]'>
              {t('floor')}
              <span className='text-red-600 ml-1'>*</span>
            </label>
            <Select
              id='demo-select-small'
              value={floor}
              onChange={handleFloorChange}
              defaultValue='1'
              sx={{ width: '200px', backgroundColor: 'white' }}
            >
              <MenuItem value='1'>{t('floor_1')}</MenuItem>
              <MenuItem value='2'>{t('floor_2')}</MenuItem>
              <MenuItem value='3'>{t('floor_3')}</MenuItem>
              <MenuItem value='4'>{t('floor_4')}</MenuItem>
              <MenuItem value='5'>{t('floor_5')}</MenuItem>
              <MenuItem value='6'>{t('floor_6')}</MenuItem>
            </Select>
          </div>
          <div>
            <label className='block text-sm font-semibold'>
              {t('apartment_number')}
              <span className='text-red-600 ml-1'>*</span>
            </label>
            <TextField
              type='text'
              value={roomNumber && floor ? `${floor}${roomNumber}` : ''}
              {...register('apartmentNumber')}
              className='bg-gray-100'
              sx={{ width: '200px', marginTop: '6px', backgroundColor: 'white' }}
            />
            <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.apartmentNumber?.message}</div>
          </div>
          <div className=''>
            <label className='block text-sm font-semibold'>
              {t('acreage')}
              <span className='text-red-600 ml-1'>*</span>
            </label>
            <TextField
              type='number'
              {...register('acreage')}
              sx={{ width: '200px', marginTop: '6px', backgroundColor: 'white' }}
            />
            <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.acreage?.message}</div>
          </div>
        </div>
        <div className=''>
          <label className='block text-sm font-semibold'>
            {t('description')}
            <span className='text-red-600 ml-1'>*</span>
          </label>
          <Input
            name='description'
            type='textarea'
            register={register}
            className='mt-[6px]'
            errorMessage={errors.description?.message}
            rows={4}
          />
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
