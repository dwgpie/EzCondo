import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ToastContainer, toast } from 'react-toastify'
import { Button, MenuItem, Select, TextField, SelectChangeEvent } from '@mui/material'
import Input from '~/components/Input'
import { AddApartmentSchema, apartmentSchema } from '~/utils/rules'
import { addApartment } from '~/apis/apartment.api'
import LoadingOverlay from '~/components/LoadingOverlay'

type FormData = AddApartmentSchema

export default function AddApartment() {
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
          return prev + 10
        })
      }, 300)

      await addApartment({
        apartmentNumber: formData.apartmentNumber,
        acreage: formData.acreage,
        description: formData.description
      })

      toast.success('Add Apartment created successfully!')
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
    <div className='pt-5 mx-5 z-13' style={{ height: 'calc(100vh - 80px)' }}>
      <ToastContainer />
      <div className='mb-6 p-6 bg-white drop-shadow-md rounded-xl'>
        {loading && <LoadingOverlay value={progress} />}
        <form className='rounded' noValidate onSubmit={onSubmit}>
          <div className='grid grid-cols-4 gap-4'>
            <div>
              <label className='block text-sm font-semibold'>
                Room Code
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <TextField
                type='number'
                value={roomNumber}
                onChange={handleRoomChange}
                sx={{ width: '200px', marginTop: '6px' }}
              />
            </div>
            <div>
              <label className='block text-sm font-semibold mb-[6px]'>
                Floor
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <Select
                id='demo-select-small'
                value={floor}
                onChange={handleFloorChange}
                defaultValue='1'
                sx={{ width: '200px' }}
              >
                <MenuItem value='1'>Floor 1</MenuItem>
                <MenuItem value='2'>Floor 2</MenuItem>
                <MenuItem value='3'>Floor 3</MenuItem>
                <MenuItem value='4'>Floor 4</MenuItem>
              </Select>
            </div>
            <div>
              <label className='block text-sm font-semibold'>
                Apartment Number
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <TextField
                type='text'
                value={roomNumber && floor ? `${floor}${roomNumber}` : ''}
                {...register('apartmentNumber')}
                className='bg-gray-100'
                sx={{ width: '200px', marginTop: '6px' }}
              />
              <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.apartmentNumber?.message}</div>
            </div>
            <div className=''>
              <label className='block text-sm font-semibold'>
                Acreage
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <TextField type='number' {...register('acreage')} sx={{ width: '200px', marginTop: '6px' }} />
              <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.acreage?.message}</div>
            </div>
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
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
