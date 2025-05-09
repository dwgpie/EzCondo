import { useRef, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Box,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  Tooltip
} from '@mui/material'
import DomainAddIcon from '@mui/icons-material/DomainAdd'
import { getAllApartment, editApartment } from '~/apis/apartment.api'
import { getUserById } from '~/apis/user.api'
import { Link } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
import { useTranslation } from 'react-i18next'

interface FormData {
  id?: string
  apartmentNumber: string
  residentNumber: string
  acreage: number
  description: string
  userId?: string
  fullName: string
  phoneNumber: string
  email: string
  gender: string
  no: string
}

export default function ListApartment() {
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const [apartmentList, setApartmentList] = useState<FormData[]>([])
  const [filteredApartments, setFilteredApartments] = useState<FormData[]>([])
  const [selectedFloor, setSelectedFloor] = useState<string>('All')
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<FormData | null>(null)
  const { t } = useTranslation('apartment')

  const getAllApartmentMutation = useMutation({
    mutationFn: async () => {
      setLoading(true)
      const response = await getAllApartment()
      return response.data
    },
    onSuccess: (data) => {
      const sortedApartments = data.sort((a: FormData, b: FormData) =>
        a.apartmentNumber.localeCompare(b.apartmentNumber, undefined, { numeric: true })
      )
      setApartmentList(sortedApartments)
      filterApartments(sortedApartments, selectedFloor)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    },
    onError: (error) => {
      console.error('Error:', error)
    }
  })

  // Lưu mutate vào useRef
  const mutateRef = useRef(getAllApartmentMutation.mutate)

  useEffect(() => {
    mutateRef.current() // Gọi mutate từ ref để tránh dependency issue
  }, [])

  const handleFloorChange = (event: SelectChangeEvent<string>) => {
    const selectedFloor = event.target.value
    setSelectedFloor(selectedFloor)
    filterApartments(apartmentList, selectedFloor)
  }

  const filterApartments = (apartments: FormData[], floor: string) => {
    if (floor === 'All') {
      setFilteredApartments(apartments)
      return
    }
    const floorNumber = floor.split(' ')[1]
    const filtered = apartments.filter((apartment) => apartment.apartmentNumber.startsWith(floorNumber))
    setFilteredApartments(filtered)
  }

  const [user, setUser] = useState<FormData | null>(null)

  const handleEditClick = async (item: FormData) => {
    setEditingItem(item)
    setOpenEditDialog(true)

    if (item.userId) {
      try {
        const response = await getUserById(item.userId)
        setUser(response.data)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
    setEditingItem(null)
    setUser(null)
  }

  const handleEditSubmit = async () => {
    if (editingItem && editingItem.id) {
      try {
        await editApartment({
          id: editingItem.id,
          acreage: editingItem.acreage,
          description: editingItem.description
        })
        toast.success(t('apartment_update_success'), {
          style: { width: 'fit-content' }
        })
        handleCloseEditDialog()
        getAllApartmentMutation.mutate()
      } catch (error) {
        console.error('Update failed:', error)
        toast.error(t('apartment_update_fail'))
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
      <div className='flex justify-between items-center mb-5'>
        <h2 className='text-2xl font-semibold text-gray-500'>{t('apartment_list')}</h2>
        <div className='flex justify-between items-center'>
          <Select
            value={selectedFloor}
            onChange={handleFloorChange}
            variant='outlined'
            size='small'
            sx={{ width: 150, height: 40, marginRight: '10px' }}
          >
            <MenuItem value='All'>{t('all')}</MenuItem>
            <MenuItem value='Floor 1'>{t('floor_1')}</MenuItem>
            <MenuItem value='Floor 2'>{t('floor_2')}</MenuItem>
            <MenuItem value='Floor 3'>{t('floor_3')}</MenuItem>
            <MenuItem value='Floor 4'>{t('floor_4')}</MenuItem>
          </Select>
          <Link to='/admin/add-apartment'>
            <Tooltip title={t('add_apartment')}>
              <Button
                variant='contained'
                sx={{
                  backgroundColor: '#5382b1',
                  width: 45,
                  height: 45,
                  marginLeft: '10px'
                }}
              >
                <DomainAddIcon />
              </Button>
            </Tooltip>
          </Link>
        </div>
      </div>
      <Box display='grid' gridTemplateColumns='repeat(auto-fill, minmax(70px, 1fr))' gap={3}>
        {filteredApartments.length > 0 ? (
          filteredApartments.map((apartment, index) => (
            <Box key={index} display='flex' justifyContent='center'>
              <Button
                variant='contained'
                style={{
                  width: 70,
                  height: 70,
                  background: apartment.residentNumber
                    ? 'linear-gradient(135deg, rgba(141, 141, 141, 0.8), rgba(200, 200, 200, 0.8))'
                    : 'linear-gradient(135deg, rgba(51, 153, 255, 0.9), rgba(133, 199, 255, 0.9))',
                  color: '#fff',
                  fontWeight: 'bold'
                }}
                onClick={() => handleEditClick(apartment)}
              >
                {apartment.apartmentNumber}
              </Button>
            </Box>
          ))
        ) : (
          <div className='col-span-full flex flex-col items-center justify-center py-4 text-gray-500'>
            <svg xmlns='http://www.w3.org/2000/svg' width='35' height='35' viewBox='0 0 24 24'>
              <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5'>
                <path d='m17.121 21.364l2.122-2.121m2.121-2.122l-2.121 2.122m0 0L17.12 17.12m2.122 2.122l2.121 2.121M4 6v6s0 3 7 3s7-3 7-3V6' />
                <path d='M11 3c7 0 7 3 7 3s0 3-7 3s-7-3-7-3s0-3 7-3m0 18c-7 0-7-3-7-3v-6' />
              </g>
            </svg>
            <p className='mt-2'>{t('no_data')}</p>
          </div>
        )}
      </Box>
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} disableEnforceFocus disableRestoreFocus>
        <DialogTitle sx={{ color: '#1976d3', fontWeight: 'bold', fontSize: '22px' }}>{t('edit_apartment')}</DialogTitle>
        <DialogContent>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <div className='flex flex-col gap-4'>
                <label className='block text-sm font-semibold'>{t('name')}</label>
                <TextField type='text' sx={{ marginTop: '-13px' }} value={user?.fullName} disabled fullWidth />
              </div>
              <div className='flex flex-col gap-4 mt-3'>
                <label className='block text-sm font-semibold'>{t('phone_number')}</label>
                <TextField type='text' sx={{ marginTop: '-13px' }} value={user?.phoneNumber} disabled fullWidth />
              </div>
              <div className='flex flex-col gap-4 mt-3'>
                <label className='block text-sm font-semibold'>{t('email')}</label>
                <TextField
                  type='text'
                  sx={{ marginTop: '-13px', width: '240px' }}
                  value={user?.email}
                  disabled
                  fullWidth
                />
              </div>
            </div>
            <div>
              <div className='flex flex-col gap-4'>
                <label className='block text-sm font-semibold'>{t('gender')}</label>
                <TextField type='text' sx={{ marginTop: '-13px' }} value={user?.gender} disabled fullWidth />
              </div>
              <div className='flex flex-col gap-4 mt-3'>
                <label className='block text-sm font-semibold'>{t('citizen_id')}</label>
                <TextField type='text' sx={{ marginTop: '-13px' }} value={user?.no} disabled fullWidth />
              </div>
              <div className='flex flex-col gap-4 mt-3'>
                <label className='block text-sm font-semibold'>{t('resident_number')}</label>
                <TextField
                  type='text'
                  sx={{ marginTop: '-13px' }}
                  value={editingItem?.residentNumber}
                  disabled
                  fullWidth
                />
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-4 mt-3'>
            <label className='block text-sm font-semibold'>
              {t('acreage')}
              <span className='text-red-600 ml-1'>*</span>
            </label>
            <TextField
              sx={{ marginTop: '-13px' }}
              type='number'
              value={editingItem?.acreage || ''}
              onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, acreage: Number(e.target.value) } : null))}
              fullWidth
            />
          </div>
          <div className='flex flex-col gap-4 mt-3'>
            <label className='block text-sm font-semibold'>
              {t('description')}
              <span className='text-red-600 ml-1'>*</span>
            </label>
            <TextField
              sx={{ marginTop: '-13px' }}
              type='text'
              value={editingItem?.description || ''}
              onChange={(e) =>
                setEditingItem((prev) => (prev ? { ...prev, description: String(e.target.value) } : null))
              }
              fullWidth
              multiline
              rows={4}
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
    </div>
  )
}
