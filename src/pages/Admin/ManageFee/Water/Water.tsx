import { Button, Slider, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { waterSchema } from '~/utils/rules'
import { addWater, getWater, editWater } from '~/apis/service.api'
import { toast } from 'react-toastify'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
import { useTranslation } from 'react-i18next'

interface FormData {
  id?: string
  pricePerM3: number
}

export default function Water() {
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<FormData | null>(null)
  const [water, setWater] = useState<FormData | null>(null)
  const { t } = useTranslation('water')

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
      setLoading(true)
      const response = await getWater()
      return response.data
    },
    onSuccess: (data) => {
      setWater(data)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
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

      toast.success(t('water_create_success'), {
        style: { width: 'fit-content' }
      })
      getWaterMutation.mutate() // Refresh data after adding
    } catch (error) {
      // Hiển thị toast lỗi với key dịch trả về từ API
      const err = error as Error
      toast.error(t(err.message), {
        style: { width: 'fit-content' }
      })
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
        toast.success(t('water_update_success'), {
          style: { width: 'fit-content' }
        })
        handleCloseEditDialog()
        getWaterMutation.mutate()
      } catch (error) {
        console.error('Update failed:', error)
      }
    }
  }

  return (
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && (
        <div className='w-full px-6 fixed top-2 left-0 z-50'>
          <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
        </div>
      )}
      <form className='rounded' noValidate onSubmit={onSubmit}>
        <div className=''>
          <h2 className='text-2xl font-semibold text-gray-500'>{t('water')}</h2>
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
                  {t('price_per_m3')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <TextField
                  type='number'
                  {...register('pricePerM3')}
                  onChange={(e) => setValue('pricePerM3', Number(e.target.value))}
                  sx={{ backgroundColor: 'white' }}
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
            {t('submit')}
          </Button>
        </div>

        <h2 className='text-2xl font-semibold text-gray-500'>{t('water_price')}</h2>

        {water ? (
          <div className='flex gap-9 mt-3 items-center'>
            <div className=''>
              <label className='block text-sm font-semibold mb-1'>
                {t('price_per_m3')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <TextField
                name='water'
                type='text'
                value={water?.pricePerM3 ?? ''} // Nếu `undefined` hoặc `null`, đặt về ""
                sx={{ backgroundColor: 'white' }}
              />
            </div>
            <div className='mt-7'>
              <button
                type='button'
                className='text-blue-500 cursor-pointer bg-blue-100 p-1.5 rounded-full'
                onClick={() => handleEditClick(water)}
              >
                <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24'>
                  <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                    <path d='M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                    <path d='M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z' />
                  </g>
                </svg>{' '}
              </button>
            </div>
          </div>
        ) : (
          <div className='mt-3 flex flex-col items-center text-gray-500'>
            <svg xmlns='http://www.w3.org/2000/svg' width='35' height='35' viewBox='0 0 24 24'>
              <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5'>
                <path d='m17.121 21.364l2.122-2.121m2.121-2.122l-2.121 2.122m0 0L17.12 17.12m2.122 2.122l2.121 2.121M4 6v6s0 3 7 3s7-3 7-3V6' />
                <path d='M11 3c7 0 7 3 7 3s0 3-7 3s-7-3-7-3s0-3 7-3m0 18c-7 0-7-3-7-3v-6' />
              </g>
            </svg>
            <p className='mt-2'>{t('no_data')}</p>
          </div>
        )}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} disableEnforceFocus disableRestoreFocus>
          <DialogTitle sx={{ color: '#1976d3', fontWeight: 'bold', fontSize: '22px' }}>
            {t('edit_water_fee')}
          </DialogTitle>
          <DialogContent>
            <div className='flex flex-col gap-4 mt-4'>
              <TextField
                label={t('price_per_m3')}
                type='number'
                value={editingItem?.pricePerM3 || ''}
                onChange={(e) =>
                  setEditingItem((prev) => (prev ? { ...prev, pricePerM3: Number(e.target.value) } : null))
                }
                fullWidth
                sx={{ backgroundColor: 'white' }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>{t('cancel')}</Button>
            <Button onClick={handleEditSubmit} variant='contained' color='primary'>
              {t('save_changes')}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  )
}
