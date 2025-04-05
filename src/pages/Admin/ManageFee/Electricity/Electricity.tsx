import { Button, Slider, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { electricitySchema } from '~/utils/rules'
import { addElectric, getElectric, editElectric, deleteElectric } from '~/apis/auth.api'
import { ToastContainer, toast } from 'react-toastify'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone'
import PlagiarismOutlinedIcon from '@mui/icons-material/PlagiarismOutlined'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import Swal from 'sweetalert2'
import DeleteIcon from '@mui/icons-material/Delete'

interface FormData {
  id?: string
  minKWh: number
  maxKWh: number
  pricePerKWh: number
}

export default function Electricity() {
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<FormData | null>(null)
  const [electric, setElectric] = useState<FormData[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(electricitySchema),
    defaultValues: {
      minKWh: 0, // Giá trị mặc định
      maxKWh: 1000,
      pricePerKWh: 0
    }
  })

  // Lắng nghe giá trị từ form
  const minKWh = watch('minKWh')
  const maxKWh = watch('maxKWh')

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setValue('minKWh', newValue[0])
      setValue('maxKWh', newValue[1])
    }
  }

  const getElectricMutation = useMutation({
    mutationFn: async () => {
      const response = await getElectric()
      return response.data
    },
    onSuccess: (data) => {
      setElectric(data)
    },
    onError: (error) => {
      console.error('Error:', error)
    }
  })

  // Lưu mutate vào useRef
  const mutateRef = useRef(getElectricMutation.mutate)

  useEffect(() => {
    mutateRef.current() // Gọi mutate từ ref để tránh dependency issue
  }, [])

  const handleCallAPI = async (formData: FormData) => {
    try {
      await addElectric({
        minKWh: formData.minKWh,
        maxKWh: formData.maxKWh,
        pricePerKWh: formData.pricePerKWh
      })

      toast.success('Set Electricity created successfully!')
      getElectricMutation.mutate() // Refresh the list after adding new item
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
        await editElectric({
          id: editingItem.id,
          minKWh: editingItem.minKWh,
          maxKWh: editingItem.maxKWh,
          pricePerKWh: editingItem.pricePerKWh
        })
        toast.success('Electricity fee updated successfully!')
        handleCloseEditDialog()
        getElectricMutation.mutate() // Refresh the list
      } catch (error) {
        console.error('Update failed:', error)
        toast.error('Failed to update electricity fee')
      }
    }
  }

  const handleDelete = (id?: string) => {
    if (!id) {
      toast.error('Invalid ID. Unable to delete.')
      return
    }

    Swal.fire({
      title: 'Are you sure you want to delete?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteElectric(id) // Gọi API với ID hợp lệ
          Swal.fire('Deleted!', 'The electricity has been successfully deleted.', 'success')
          getElectricMutation.mutate()
        } catch (error) {
          Swal.fire('Error!', 'Unable to delete the electricity!', 'error')
          console.error('Error deleting electricity:', error)
        }
      }
    })
  }

  return (
    <div className='pt-5 mx-5 z-13'>
      <ToastContainer />
      <div className='mb-6 p-6 bg-white drop-shadow-md rounded-xl'>
        <form className='rounded' noValidate onSubmit={onSubmit}>
          <div className=''>
            <Typography variant='h5'>Electricity</Typography>
            <div className='w-full mt-10 px-10'>
              <Slider
                value={[minKWh, maxKWh]}
                onChange={handleSliderChange}
                valueLabelDisplay='on'
                valueLabelFormat={(value) => `${value} kWh`}
                min={0}
                max={5000}
                step={100}
                marks={Array.from({ length: 21 }, (_, i) => ({
                  value: i * 500,
                  label: `${i * 500}`
                }))}
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
                    Min KWh
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <TextField
                    type='number'
                    {...register('minKWh')}
                    onChange={(e) => setValue('minKWh', Number(e.target.value))}
                  />
                </div>
                <div className='flex flex-col items-start'>
                  <label className='block text-sm font-semibold mb-1'>
                    Max KWh
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <TextField
                    type='number'
                    {...register('maxKWh')}
                    onChange={(e) => setValue('maxKWh', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold mb-1'>
                    Price Per KWh
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <TextField
                    type='number'
                    {...register('pricePerKWh')}
                    onChange={(e) => setValue('pricePerKWh', Math.round(Number(e.target.value)))}
                  />
                  <div className='mt-1 text-xs text-red-500 min-h-4'>{errors.pricePerKWh?.message}</div>
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
          <Typography variant='h5'>Electricity Price</Typography>
          {electric.length > 0 ? (
            electric.map((electric) => (
              <div key={electric.id} className='flex gap-9 mt-3 items-center'>
                <div className=''>
                  <label className='block text-sm font-semibold mb-1'>
                    Min KWh
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <TextField name='electric' type='text' value={electric.minKWh} />
                </div>
                <div className=''>
                  <label className='block text-sm font-semibold mb-1'>
                    Max KWh
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <TextField name='electric' type='text' value={electric.maxKWh} />
                </div>
                <div className=''>
                  <label className='block text-sm font-semibold mb-1'>
                    Price Per KWh
                    <span className='text-red-600 ml-1'>*</span>
                  </label>
                  <TextField name='electric' type='text' value={electric.pricePerKWh} />
                </div>
                <div className='mt-7'>
                  <button
                    type='button'
                    className='text-blue-500 cursor-pointer bg-blue-100 p-2 rounded-full'
                    onClick={() => handleEditClick(electric)}
                  >
                    <EditNoteTwoToneIcon />
                  </button>
                  <button
                    type='button'
                    className='text-red-500 cursor-pointer bg-red-100 p-2 rounded-full ml-2'
                    onClick={() => {
                      handleDelete(electric.id)
                    }}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='mt-3 text-center text-gray-500'>
              <PlagiarismOutlinedIcon fontSize='large' />
              <p className='mt-2'>No data available</p>
            </div>
          )}

          <Dialog open={openEditDialog} onClose={handleCloseEditDialog} disableEnforceFocus disableRestoreFocus>
            <DialogTitle sx={{ color: '#1976d3', fontWeight: 'bold', fontSize: '22px' }}>
              Edit Electricity Fee
            </DialogTitle>
            <DialogContent>
              <div className='flex flex-col gap-4 mt-4'>
                <TextField
                  label='Min KWh'
                  type='number'
                  value={editingItem?.minKWh || ''}
                  onChange={(e) =>
                    setEditingItem((prev) => (prev ? { ...prev, minKWh: Number(e.target.value) } : null))
                  }
                  fullWidth
                />
                <TextField
                  label='Max KWh'
                  type='number'
                  value={editingItem?.maxKWh || ''}
                  onChange={(e) =>
                    setEditingItem((prev) => (prev ? { ...prev, maxKWh: Number(e.target.value) } : null))
                  }
                  fullWidth
                />
                <TextField
                  label='Price Per KWh'
                  type='number'
                  value={editingItem?.pricePerKWh || ''}
                  onChange={(e) =>
                    setEditingItem((prev) =>
                      prev ? { ...prev, pricePerKWh: Math.round(Number(e.target.value)) } : null
                    )
                  }
                  fullWidth
                  error={!!errors.pricePerKWh}
                  helperText={errors.pricePerKWh?.message}
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
