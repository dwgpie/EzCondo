import { useRef, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast, ToastContainer } from 'react-toastify'
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
  const [apartmentList, setApartmentList] = useState<FormData[]>([])
  const [filteredApartments, setFilteredApartments] = useState<FormData[]>([]) // Lưu trữ các apartment đã lọc
  const [selectedFloor, setSelectedFloor] = useState<string>('Floor 1') // Mặc định là Floor 1
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<FormData | null>(null)

  const getAllApartmentMutation = useMutation({
    mutationFn: async () => {
      const response = await getAllApartment()
      return response.data
    },
    onSuccess: (data) => {
      setApartmentList(data)
      filterApartments(data, selectedFloor) // Lọc các apartment khi tải xong dữ liệu
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
    const floorNumber = floor.split(' ')[1]
    const filtered = apartments.filter(
      (apartment) => apartment.apartmentNumber.startsWith(floorNumber) // Lọc các apartment có đuôi trùng với tầng
    )
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
        toast.success('Apartment updated successfully!')
        handleCloseEditDialog()
        getAllApartmentMutation.mutate() // Refresh data after editing
      } catch (error) {
        console.error('Update failed:', error)
        toast.error('Failed to update apartment')
      }
    }
  }

  return (
    <div className='pt-5 mx-5 z-13'>
      <ToastContainer />
      <div className='mb-6 p-6 bg-white drop-shadow-md rounded-xl'>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 20 }}>
          <Select
            value={selectedFloor}
            onChange={handleFloorChange} // Cập nhật kiểu sự kiện là SelectChangeEvent<string>
            variant='outlined'
            size='small'
          >
            <MenuItem value='Floor 1'>Floor 1</MenuItem>
            <MenuItem value='Floor 2'>Floor 2</MenuItem>
            <MenuItem value='Floor 3'>Floor 3</MenuItem>
            <MenuItem value='Floor 4'>Floor 4</MenuItem>
          </Select>
          <Link to='/admin/add-apartment'>
            <Tooltip title='Add Appartment'>
              <Button
                variant='contained'
                color='primary'
                sx={{
                  background: 'linear-gradient(135deg, rgba(0, 82, 165, 0.9), rgba(86, 172, 252, 0.9))',
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
        <Box display='grid' gridTemplateColumns='repeat(auto-fill, minmax(70px, 1fr))' gap={3}>
          {filteredApartments.map((apartment, index) => (
            <Box key={index} display='flex' justifyContent='center'>
              <Button
                variant='contained'
                style={{
                  width: 70,
                  height: 70,
                  background: apartment.residentNumber
                    ? 'linear-gradient(135deg, rgba(141, 141, 141, 0.8), rgba(200, 200, 200, 0.8))' // Xanh đậm + Xám sáng
                    : 'linear-gradient(135deg, rgba(0, 82, 165, 0.9), rgba(86, 172, 252, 0.9))', // Xanh dương + Xám đậm
                  color: '#fff',
                  fontWeight: 'bold'
                }}
                onClick={() => handleEditClick(apartment)}
              >
                {apartment.apartmentNumber}
              </Button>
            </Box>
          ))}
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
    </div>
  )
}
