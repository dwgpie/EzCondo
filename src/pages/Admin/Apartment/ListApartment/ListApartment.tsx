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
        toast.success('Apartment updated successfully!', {
          style: { width: 'fit-content' }
        })
        handleCloseEditDialog()
        getAllApartmentMutation.mutate()
      } catch (error) {
        console.error('Update failed:', error)
        toast.error('Failed to update apartment')
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
        <h2 className='text-2xl font-semibold text-gray-500'>List Apartments</h2>
        <div className='flex justify-between items-center'>
          <Select
            value={selectedFloor}
            onChange={handleFloorChange} // Cập nhật kiểu sự kiện là SelectChangeEvent<string>
            variant='outlined'
            size='small'
            sx={{ width: 150, height: 40, marginRight: '10px' }}
          >
            <MenuItem value='All'>All</MenuItem>
            <MenuItem value='Floor 1'>Floor 1</MenuItem>
            <MenuItem value='Floor 2'>Floor 2</MenuItem>
            <MenuItem value='Floor 3'>Floor 3</MenuItem>
            <MenuItem value='Floor 4'>Floor 4</MenuItem>
          </Select>
          <Link to='/admin/add-apartment'>
            <Tooltip title='Add Appartment'>
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
            <p className='mt-2'>No data available</p>
          </div>
        )}
      </Box>
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} disableEnforceFocus disableRestoreFocus>
        <DialogTitle sx={{ color: '#1976d3', fontWeight: 'bold', fontSize: '22px' }}>Edit Apartment</DialogTitle>
        <DialogContent>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <div className='flex flex-col gap-4'>
                <label className='block text-sm font-semibold'>Name</label>
                <TextField type='text' sx={{ marginTop: '-13px' }} value={user?.fullName} disabled fullWidth />
              </div>
              <div className='flex flex-col gap-4 mt-3'>
                <label className='block text-sm font-semibold'>Phone number</label>
                <TextField type='text' sx={{ marginTop: '-13px' }} value={user?.phoneNumber} disabled fullWidth />
              </div>
              <div className='flex flex-col gap-4 mt-3'>
                <label className='block text-sm font-semibold'>Email</label>
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
                <label className='block text-sm font-semibold'>Gender</label>
                <TextField type='text' sx={{ marginTop: '-13px' }} value={user?.gender} disabled fullWidth />
              </div>
              <div className='flex flex-col gap-4 mt-3'>
                <label className='block text-sm font-semibold'>Citizen ID</label>
                <TextField type='text' sx={{ marginTop: '-13px' }} value={user?.no} disabled fullWidth />
              </div>
              <div className='flex flex-col gap-4 mt-3'>
                <label className='block text-sm font-semibold'>Resident Number</label>
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
              Acreage
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
              Description
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
    </div>
  )
}
