import { Button, Slider, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { waterSchema } from '~/utils/rules'
import { addWater, getWater, editWater } from '~/apis/service.api'
import { ToastContainer, toast } from 'react-toastify'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone'
import PlagiarismOutlinedIcon from '@mui/icons-material/PlagiarismOutlined'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

interface FormData {
  id?: string
  pricePerM3: number
}

export default function Water() {
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<FormData | null>(null)
  const [water, setWater] = useState<FormData | null>(null)

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: yupResolver(waterSchema),
    defaultValues: {
      pricePerM3: 0
    }
  })

  // Lắng nghe giá trị từ form
  const pricePerM3 = watch('pricePerM3')

  const handleSliderChangeWater = (_event: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) {
      setValue('pricePerM3', newValue)
    }
  }

  const getWaterMutation = useMutation({
    mutationFn: async () => {
      const response = await getWater()
      return response.data
    },
    onSuccess: (data) => {
      setWater(data)
    },
    onError: (error) => {
      console.error('Error:', error)
    }
  })

  // Lưu mutate vào useRef
  const mutateRef = useRef(getWaterMutation.mutate)

  useEffect(() => {
    mutateRef.current() // Gọi mutate từ ref để tránh dependency issue
  }, [])

  const handleCallAPI = async (formData: FormData) => {
    try {
      await addWater({
        pricePerM3: formData.pricePerM3
      })

      toast.success('Set Water created successfully!', {
        style: { width: 'fit-content' }
      })
      getWaterMutation.mutate() // Refresh data after adding
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
        await editWater({
          id: editingItem.id,
          pricePerM3: editingItem.pricePerM3
        })
        toast.success('Water Fee updated successfully!', {
          style: { width: 'fit-content' }
        })
        handleCloseEditDialog()
        getWaterMutation.mutate() // Refresh data after editing
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
            <Typography variant='h5'>Water</Typography>
            <div className='w-full mt-10 px-10'>
              <Slider
                value={pricePerM3}
                onChange={handleSliderChangeWater}
                valueLabelDisplay='on'
                valueLabelFormat={(value) => `${value} VND`}
                min={0}
                max={100000}
                marks={[
                  { value: 0, label: '0' },
                  { value: 10000, label: '10K' },
                  { value: 20000, label: '20K' },
                  { value: 30000, label: '30K' },
                  { value: 40000, label: '40K' },
                  { value: 50000, label: '50K' },
                  { value: 60000, label: '60K' },
                  { value: 70000, label: '70K' },
                  { value: 80000, label: '80K' },
                  { value: 90000, label: '90K' },
                  { value: 100000, label: '100K' }
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
                  <label className='block text-sm font-semibold mb-1'>
                    Price Per m³
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <TextField
                    type='number'
                    {...register('pricePerM3')}
                    onChange={(e) => setValue('pricePerM3', Number(e.target.value))}
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
              Submit
            </Button>
          </div>

          <Typography variant='h5'>Water Price</Typography>
          {water ? (
            <div className='flex gap-9 mt-3 items-center'>
              <div className=''>
                <label className='block text-sm font-semibold mb-1'>
                  Price Per m³
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <TextField
                  name='water'
                  type='text'
                  value={water?.pricePerM3 ?? ''} // Nếu `undefined` hoặc `null`, đặt về ""
                />
              </div>
              <div className='mt-7'>
                <button
                  type='button'
                  className='text-blue-500 cursor-pointer bg-blue-100 p-2 rounded-full'
                  onClick={() => handleEditClick(water)}
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
            <DialogTitle sx={{ color: '#1976d3', fontWeight: 'bold', fontSize: '22px' }}>Edit Water Fee</DialogTitle>
            <DialogContent>
              <div className='flex flex-col gap-4 mt-4'>
                <TextField
                  label='Price Per m³'
                  type='number'
                  value={editingItem?.pricePerM3 || ''}
                  onChange={(e) =>
                    setEditingItem((prev) => (prev ? { ...prev, pricePerM3: Number(e.target.value) } : null))
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
