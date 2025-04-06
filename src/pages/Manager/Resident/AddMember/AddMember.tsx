import { useContext, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { styled } from '@mui/material/styles'
import { ToastContainer, toast } from 'react-toastify'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import InputEdit from '~/components/InputEdit'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'

import { getHouseholdMember, addOrUpdateMember, deleteMember } from '~/apis/HouseholdMember.api'
import { getUserById } from '~/apis/user.api'

import Swal from 'sweetalert2'

interface User {
  id: string
  apartmentNumber: string
  no: string
  fullName: string
  dateOfBirth: string
  gender: string
  phoneNumber: string
  relationship: string
}
interface Resident {
  id: string
  apartmentNumber: string
  fullName: string
}

export default function AddMember() {
  const [listMember, setListMember] = useState<User[]>([])
  const [resident, setResident] = useState<Resident | null>(null)
  const getUserIdFromURL = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('userId') // Đảm bảo đúng với cách truyền userId
  }

  const userId = getUserIdFromURL()
  const [apartmentNumber, setApartmentNumber] = useState<string>('')

  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    phoneNumber: '',
    no: '',
    relationship: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getResident = useMutation({
    mutationFn: async () => {
      if (!userId) return
      const response = await getUserById(userId)
      setResident(response.data)
      setApartmentNumber(response.data.apartmentNumber)
    },
    onSuccess: (data) => {
      console.log('get resident thành công:', data)
    },
    onError: (error) => {
      console.error('Lỗi khi hiển thị danh sách cư dân:', error)
    }
  })

  const getMember = useMutation({
    mutationFn: async () => {
      if (!apartmentNumber) {
        console.log('không có apart')
        return
      }

      const response = await getHouseholdMember(apartmentNumber)
      setListMember(response.data)
    },
    onSuccess: (data) => {
      console.log('Danh sách cư dân thành công:', data)
    },
    onError: (error) => {
      console.error('Lỗi khi hiển thị danh sách cư dân:', error)
    }
  })

  useEffect(() => {
    getResident.mutate()
    getMember.mutate()
  }, [userId, apartmentNumber])

  const handleDelete = (id: string) => {
    console.log('click', id)

    // const delMember = useMutation({
    //   mutationFn: async () => {
    //     if (!apartmentNumber) {
    //       console.log('không có apart')
    //       return
    //     }

    //     await deleteMember(id)
    //   },
    //   onSuccess: (data) => {
    //     console.log('Delete thành công:', data)
    //   },
    //   onError: (error) => {
    //     console.error('Lỗi khi delete:', error)
    //   }
    // })

    // delMember.mutate()

    Swal.fire({
      title: 'Are you sure you want to delete?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          deleteMember(id) // Gọi API xóa user
          Swal.fire('Deleted!', 'The member has been successfully deleted.', 'success')
          // Cập nhật danh sách user (nếu bạn lưu users trong state)
          setListMember(listMember.filter((user) => user.id !== id))
        } catch (error) {
          Swal.fire('Error!', 'Unable to delete the member!', 'error')
          console.error('Error deleting user:', error)
        }
      }
    })
  }
  const handleAdd = async () => {
    console.log('form: ', formData)
    try {
      if (!apartmentNumber || !resident) return
      await addOrUpdateMember({
        id: null,
        apartmentNumber: resident.apartmentNumber,
        ...formData
      })

      toast.success('Updated successfully!')
    } catch (error) {
      console.error('Error updating user or citizen:', error)
    }
  }

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#f4f4f5',
      color: theme.palette.common.black,
      fontWeight: 'bold',
      fontFamily: 'Roboto'
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      fontFamily: 'Roboto'
    }
  }))

  const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(even)': {
      backgroundColor: '#F9FAFD'
    },
    '&:last-child td, &:last-child th': {
      border: 0
    },
    '&:hover': {
      backgroundColor: '#f5f5f5'
    }
  }))
  return (
    <div style={{ height: 'calc(100vh - 80px)' }} className='bg-[#EDF1F9]  pt-5 ml-5 mr-5 z-13'>
      <div className='bg-[#fff] rounded-xl mb-[20px] shadow-md pb-[20px]'>
        <div>
          <div className='flex gap-[100px] w-full h-[60px] rounded-t-xl bg-[#f5faff] items-center '>
            <h2 className='text-[20px] text-[#344050] font-semibold ml-[24px]'>Name: {resident?.fullName}</h2>
            <h2 className='text-[20px] text-[#344050] font-semibold ml-[24px]'>Apartment: {apartmentNumber}</h2>
          </div>
          <div>
            <Paper elevation={4}>
              <TableContainer>
                <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell width='5%'>Id</StyledTableCell>
                      <StyledTableCell width='15%'>Full Name</StyledTableCell>
                      <StyledTableCell width='10%'>Gender</StyledTableCell>
                      <StyledTableCell width='15%'>Date of birth</StyledTableCell>
                      <StyledTableCell width='15%'>Phone number</StyledTableCell>
                      <StyledTableCell width='15%'>Citizen identity no</StyledTableCell>
                      <StyledTableCell width='20%'>Relationship to household head</StyledTableCell>
                      <StyledTableCell width='5%'>Delete</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listMember.length > 0 ? (
                      listMember.map((user, index) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>{index + 1}</StyledTableCell>
                          <StyledTableCell>{user.fullName}</StyledTableCell>
                          <StyledTableCell>{user.gender}</StyledTableCell>
                          <StyledTableCell>
                            {new Intl.DateTimeFormat('vi-VN').format(new Date(user.dateOfBirth))}
                          </StyledTableCell>
                          <StyledTableCell>{user.phoneNumber}</StyledTableCell>
                          <StyledTableCell>{user.no}</StyledTableCell>
                          <StyledTableCell>{user.relationship}</StyledTableCell>
                          <StyledTableCell>
                            <button
                              className=' cursor-pointer'
                              onClick={() => {
                                handleDelete(user.id)
                              }}
                            >
                              <DeleteIcon />
                            </button>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <p>Không có dữ liệu</p>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <div className='flex mt-[30px] justify-between'>
              <div className='ml-[20px]'>
                <label className='block text-sm font-semibold mt-[13px]'>
                  Name
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <input
                  type='text'
                  name='fullName'
                  onChange={handleChange}
                  className='w-[200px] h-11 pl-2 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                />
              </div>

              <div className=''>
                <label className='block text-sm font-semibold mt-[13px]'>
                  Gender
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <select
                  onChange={handleChange}
                  name='gender'
                  defaultValue='female'
                  className=' w-[150px] h-11 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                >
                  <option value='female'>Female</option>
                  <option value='male'>Male</option>
                  <option value='other'>Other</option>
                </select>
              </div>

              <div className=''>
                <label className='block text-sm font-semibold mt-[13px]'>
                  Date of birth
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <input
                  type='date'
                  name='dateOfBirth'
                  onChange={handleChange}
                  className='w-[200px] h-11 pl-2 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                />
              </div>

              <div className=''>
                <label className='block text-sm font-semibold mt-[13px]'>
                  Phone number
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <input
                  type='text'
                  name='phoneNumber'
                  onChange={handleChange}
                  className='w-[200px] h-11 pl-2 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                />
              </div>

              <div className=''>
                <label className='block text-sm font-semibold mt-[13px]'>
                  Citizen identity no
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <input
                  type='text'
                  name='no'
                  onChange={handleChange}
                  className='w-[200px] h-11 pl-2 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                />
              </div>

              <div className=' mr-[20px]'>
                <label className='block text-sm font-semibold mt-[13px]'>
                  Relationship to household head
                  <span className='text-red-600 ml-1'>*</span>
                </label>
                <select
                  onChange={handleChange}
                  name='relationship'
                  defaultValue='father'
                  className=' w-full h-11 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                >
                  <option value='father'>Father</option>
                  <option value='mother'>Mother</option>
                  <option value='wife'>Wife</option>
                  <option value='son'>Son</option>
                  <option value='daughter'>Daughter</option>
                  <option value='relative'>Relative</option>
                  <option value='grandchild'>Grandchild</option>
                  <option value='tenant'>Tenant</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-4 mt-6 mr-[2%] '>
          <Button
            variant='contained'
            onClick={() => {
              // Xử lý logic cancel
            }}
            style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }} // Add this line
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleAdd}
            style={{ color: 'white', fontWeight: 'semi-bold' }} // Add this line
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
