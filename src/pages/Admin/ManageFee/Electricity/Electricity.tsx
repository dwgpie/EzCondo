import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slider, TextField } from '@mui/material'
import { addElectric, getElectric, editElectric, deleteElectric } from '~/apis/service.api'
import { electricitySchema } from '~/utils/rules'
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
import { useTranslation } from 'react-i18next'

interface FormData {
  id?: string
  minKWh: number
  maxKWh: number
  pricePerKWh: number
}

export default function Electricity() {
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<FormData | null>(null)
  const [electric, setElectric] = useState<FormData[]>([])
  const { t } = useTranslation('electric')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      setLoading(true)
      const response = await getElectric()
      return response.data
    },
    onSuccess: (data) => {
      const sortedData = [...data].sort((a, b) => a.minKWh - b.minKWh)
      setElectric(sortedData)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
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
        toast.success(t('electricity_update_success'), {
          style: { width: 'fit-content' }
        })
        handleCloseEditDialog()
        getElectricMutation.mutate()
      } catch (error) {
        console.error('Update failed:', error)
      }
    }
  }

  const handleCallAPI = async (formData: FormData) => {
    try {
      // Kiểm tra dữ liệu có tồn tại rồi không (dựa trên minKWh, maxKWh, pricePerKWh)
      const exists = electric.some(
        (item) =>
          item.minKWh === formData.minKWh &&
          item.maxKWh === formData.maxKWh &&
          item.pricePerKWh === formData.pricePerKWh
      )
      if (exists) {
        toast.error(t('duplicate_entry'), {
          style: { width: 'fit-content' }
        })
        return
      }

      setIsSubmitting(true)
      await addElectric({
        minKWh: formData.minKWh,
        maxKWh: formData.maxKWh,
        pricePerKWh: formData.pricePerKWh
      })
      toast.success(t('electricity_create_success'), {
        style: { width: 'fit-content' }
      })
      getElectricMutation.mutate()
    } catch (error) {
      console.error('API call failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = handleSubmit((formData) => {
    if (isSubmitting) return // Chặn submit khi đang gửi
    handleCallAPI(formData)
  })

  const handleDelete = (id?: string) => {
    if (!id) {
      toast.error(t('invalid_id'))
      return
    }

    Swal.fire({
      title: t('delete_confirm_title'),
      text: t('delete_confirm_text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('delete'),
      cancelButtonText: t('cancel'),
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteElectric(id) // Gọi API với ID hợp lệ
          Swal.fire(t('deleted'), t('electricity_deleted_success'), 'success')
          getElectricMutation.mutate()
        } catch (error) {
          Swal.fire('Error!', t('electricity_delete_fail'), 'error')
          console.error('Error deleting electricity:', error)
        }
      }
    })
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
          <h2 className='text-2xl font-semibold text-gray-500'>{t('electricity')}</h2>
          <div className='w-full mt-10 px-10'>
            <Slider
              value={[minKWh, maxKWh]}
              onChange={handleSliderChange}
              valueLabelDisplay='on'
              valueLabelFormat={(value) => `${value} kWh`}
              min={0}
              max={1000}
              step={50}
              marks={Array.from({ length: 21 }, (_, i) => ({
                value: i * 100,
                label: `${i * 100}`
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
                  {t('min_kwh')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <TextField
                  type='number'
                  {...register('minKWh')}
                  onChange={(e) => setValue('minKWh', Number(e.target.value))}
                  sx={{ backgroundColor: 'white' }}
                />
              </div>
              <div className='flex flex-col items-start'>
                <label className='block text-sm font-semibold mb-1'>
                  {t('max_kwh')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <TextField
                  type='number'
                  {...register('maxKWh')}
                  onChange={(e) => setValue('maxKWh', Number(e.target.value))}
                  sx={{ backgroundColor: 'white' }}
                />
              </div>
              <div>
                <label className='block text-sm font-semibold mb-1'>
                  {t('price_per_kwh')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <TextField
                  type='number'
                  {...register('pricePerKWh')}
                  onChange={(e) => setValue('pricePerKWh', Math.round(Number(e.target.value)))}
                  sx={{ backgroundColor: 'white' }}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>
        </div>
        <h2 className='text-2xl font-semibold text-gray-500 pb-1'>{t('electricity_price')}</h2>
        {electric.length > 0 ? (
          electric.map((electric) => (
            <div key={electric.id} className='flex gap-9 mt-3 items-center'>
              <div className=''>
                <label className='block text-sm font-semibold mb-1'>
                  {t('min_kwh')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <TextField name='electric' type='text' value={electric.minKWh} sx={{ backgroundColor: 'white' }} />
              </div>
              <div className=''>
                <label className='block text-sm font-semibold mb-1'>
                  {t('max_kwh')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <TextField name='electric' type='text' value={electric.maxKWh} sx={{ backgroundColor: 'white' }} />
              </div>
              <div className=''>
                <label className='block text-sm font-semibold mb-1'>
                  {t('price_per_kwh')}
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <TextField name='electric' type='text' value={electric.pricePerKWh} sx={{ backgroundColor: 'white' }} />
              </div>
              <div className='mt-7'>
                <button
                  type='button'
                  className='text-blue-500 cursor-pointer bg-blue-100 p-1.5 rounded-full'
                  onClick={() => handleEditClick(electric)}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24'>
                    <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                      <path d='M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                      <path d='M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z' />
                    </g>
                  </svg>
                </button>
                <button
                  type='button'
                  className='text-red-500 cursor-pointer bg-red-100 p-1.5 rounded-full ml-2'
                  onClick={() => {
                    handleDelete(electric.id)
                  }}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 48 48'>
                    <defs>
                      <mask id='ipTDelete0'>
                        <g fill='none' stroke='#fff' strokeLinejoin='round' strokeWidth='4'>
                          <path fill='#555555' d='M9 10v34h30V10z' />
                          <path strokeLinecap='round' d='M20 20v13m8-13v13M4 10h40' />
                          <path fill='#555555' d='m16 10l3.289-6h9.488L32 10z' />
                        </g>
                      </mask>
                    </defs>
                    <path fill='currentColor' d='M0 0h48v48H0z' mask='url(#ipTDelete0)' />
                  </svg>{' '}
                </button>
              </div>
            </div>
          ))
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
            {t('edit_electricity_fee')}
          </DialogTitle>
          <DialogContent>
            <div className='flex flex-col gap-4 mt-4'>
              <TextField
                label={t('min_kwh')}
                type='number'
                value={editingItem?.minKWh || ''}
                onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, minKWh: Number(e.target.value) } : null))}
                fullWidth
                sx={{ backgroundColor: 'white' }}
              />
              <TextField
                label={t('max_kwh')}
                type='number'
                value={editingItem?.maxKWh || ''}
                onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, maxKWh: Number(e.target.value) } : null))}
                fullWidth
                sx={{ backgroundColor: 'white' }}
              />
              <TextField
                label={t('price_per_kwh')}
                type='number'
                value={editingItem?.pricePerKWh || ''}
                onChange={(e) =>
                  setEditingItem((prev) => (prev ? { ...prev, pricePerKWh: Math.round(Number(e.target.value)) } : null))
                }
                fullWidth
                error={!!errors.pricePerKWh}
                helperText={errors.pricePerKWh?.message}
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
