import { Button, Slider, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { parkingSchema } from '~/utils/rules'
import { addParking, getParking, editParking } from '~/apis/service.api'
import { ToastContainer, toast } from 'react-toastify'
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone'
import PlagiarismOutlinedIcon from '@mui/icons-material/PlagiarismOutlined'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

interface FormData {
  id?: string
  pricePerMotor: number
  pricePerOto: number
}

export default function Parking() {
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<FormData | null>(null)
  const [parking, setParking] = useState<FormData | null>(null)

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: yupResolver(parkingSchema),
    defaultValues: {
      pricePerMotor: 0,
      pricePerOto: 0
    }
  })

  // Lắng nghe giá trị từ form
  const pricePerMotor = watch('pricePerMotor')
  const pricePerOto = watch('pricePerOto')

  const handleSliderChangeMotor = (_event: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) {
      setValue('pricePerMotor', newValue)
    }
  }

  const handleSliderChangeOto = (_event: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) {
      setValue('pricePerOto', newValue)
    }
  }

  const getParkingMutation = useMutation({
    mutationFn: async () => {
      const response = await getParking()
      return response.data
    },
    onSuccess: (data) => {
      setParking(data)
    },
    onError: (error) => {
      console.error('Error:', error)
    }
  })

  // Lưu mutate vào useRef
  const mutateRef = useRef(getParkingMutation.mutate)

  useEffect(() => {
    mutateRef.current() // Gọi mutate từ ref để tránh dependency issue
  }, [])

  const handleCallAPI = async (formData: FormData) => {
    try {
      await addParking({
        pricePerMotor: formData.pricePerMotor,
        pricePerOto: formData.pricePerOto
      })

      toast.success('Set Parking created successfully!', {
        style: { width: 'fit-content' }
      })
      getParkingMutation.mutate() // Refresh data after adding
    } catch (error) {
      console.error('API call failed:', error)
    }
  }

  // Xử lý submit form
  const onSubmit = handleSubmit((formData) => {
    handleCallAPI(formData)
  })

  const handleEditClick = (item: FormData) => {
    setEditingItem(item)
    setOpenEditDialog(true)
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
    setEditingItem(null)
  }

  const handleEditSubmit = async () => {
    if (editingItem && editingItem.id) {
      try {
        await editParking({
          id: editingItem.id,
          pricePerMotor: editingItem.pricePerMotor,
          pricePerOto: editingItem.pricePerOto
        })
        toast.success('Parking fee updated successfully!', {
          style: { width: 'fit-content' }
        })
        handleCloseEditDialog()
        getParkingMutation.mutate() // Refresh data after editing
      } catch (error) {
        console.error('Update failed:', error)
      }
    }
  }

  return (
    <div className='pt-5 mx-5 z-13' style={{ height: 'calc(100vh - 80px)' }}>
      <ToastContainer />
      <div className='mb-6 p-6 bg-gradient-to-br from-white via-white to-blue-100 shadow-xl rounded-2xl space-y-6'>
        <form className='rounded' noValidate onSubmit={onSubmit}>
          <div className=''>
            <Typography variant='h5'>Motorbike</Typography>
            <div className=' mt-10 px-10 flex gap-4'>
              <div className='w-full'>
                <Slider
                  value={pricePerMotor}
                  onChange={handleSliderChangeMotor}
                  valueLabelDisplay='on'
                  valueLabelFormat={(value) => `${value} VND`}
                  min={0}
                  max={500000}
                  step={10000}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 100000, label: '100K' },
                    { value: 200000, label: '200K' },
                    { value: 300000, label: '300K' },
                    { value: 400000, label: '400K' },
                    { value: 500000, label: '500K' }
                  ]}
                  sx={{
                    '& .MuiSlider-valueLabel': {
                      backgroundColor: 'transparent',
                      color: '#1976d2',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </div>
              <div className='ml-5 mt-[-30px]'>
                <label className='block text-sm font-semibold mb-1'>
                  Price Per Motor
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <TextField
                  type='number'
                  {...register('pricePerMotor')}
                  onChange={(e) => setValue('pricePerMotor', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <div className='mt-8'>
            <Typography variant='h5'>Car</Typography>
            <div className=' mt-10 px-10 flex gap-4'>
              <div className='w-full'>
                <Slider
                  value={pricePerOto}
                  onChange={handleSliderChangeOto}
                  valueLabelDisplay='on'
                  valueLabelFormat={(value) => `${value} VND`}
                  min={0}
                  max={500000}
                  step={10000}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 100000, label: '100K' },
                    { value: 200000, label: '200K' },
                    { value: 300000, label: '300K' },
                    { value: 400000, label: '400K' },
                    { value: 500000, label: '500K' }
                  ]}
                  sx={{
                    '& .MuiSlider-valueLabel': {
                      backgroundColor: 'transparent',
                      color: '#1976d2',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </div>

              <div className='ml-5 mt-[-30px]'>
                <label className='block text-sm font-semibold mb-1'>
                  Price Per Car
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <TextField
                  type='number'
                  {...register('pricePerOto')}
                  onChange={(e) => setValue('pricePerOto', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <div className='flex justify-end gap-4 mt-10'>
            <Button
              type='submit'
              variant='contained'
              style={{ color: 'white', background: '#2976ce', fontWeight: 'semi-bold' }}
            >
              Submit
            </Button>
          </div>
          <Typography variant='h5'>Parking Price</Typography>
          {parking ? (
            <div className='flex gap-9 mt-3 items-center'>
              <div className='mt-2'>
                <label className='block text-sm font-semibold mb-1'>
                  Price Per Motorbike
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <TextField
                  name='pricePerMotor'
                  type='text'
                  value={parking?.pricePerMotor ?? ''} // Nếu `undefined` hoặc `null`, đặt về ""
                />
              </div>
              <div className='mt-2'>
                <label className='block text-sm font-semibold mb-1'>
                  Price Per Car
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <TextField
                  name='pricePerOto'
                  type='text'
                  value={parking?.pricePerOto ?? ''} // Nếu `undefined` hoặc `null`, đặt về ""
                />
              </div>
              <div className='mt-7'>
                <button
                  type='button'
                  className='text-blue-500 cursor-pointer bg-blue-100 p-2 rounded-full'
                  onClick={() => handleEditClick(parking)}
                >
                  <EditNoteTwoToneIcon />
                </button>
              </div>
            </div>
          ) : (
            <div className='mt-3 text-center text-gray-500'>
              <PlagiarismOutlinedIcon fontSize='large' />
              <p className='mt-2'>No data available</p>
            </div>
          )}
          <Dialog open={openEditDialog} onClose={handleCloseEditDialog} disableEnforceFocus disableRestoreFocus>
            <DialogTitle sx={{ color: '#1976d3', fontWeight: 'bold', fontSize: '22px' }}>Edit Parking Fee</DialogTitle>
            <DialogContent>
              <div className='flex flex-col gap-4 mt-4'>
                <TextField
                  label='Price Per Motorbike'
                  type='number'
                  value={editingItem?.pricePerMotor || ''}
                  onChange={(e) =>
                    setEditingItem((prev) => (prev ? { ...prev, pricePerMotor: Number(e.target.value) } : null))
                  }
                  fullWidth
                />
              </div>
              <div className='flex flex-col gap-4 mt-4'>
                <TextField
                  label='Price Per Car'
                  type='number'
                  value={editingItem?.pricePerOto || ''}
                  onChange={(e) =>
                    setEditingItem((prev) => (prev ? { ...prev, pricePerOto: Number(e.target.value) } : null))
                  }
                  fullWidth
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog}>Cancel</Button>
              <Button onClick={handleEditSubmit} variant='contained' color='primary'>
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </div>
    </div>
  )
}
