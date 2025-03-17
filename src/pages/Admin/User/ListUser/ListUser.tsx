import { useContext, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SideBarAdmin from '~/components/SideBar/SideBarAdmin'
import { getAllUser, deleteUser, searchUser } from '~/apis/auth.api'
import Swal from 'sweetalert2'
import { SearchContext } from '~/components/Search/SearchContext'

interface User {
  id: string
  fullName: string
  dateOfBirth: string
  gender: string
  apartmentNumber: string
  phoneNumber: string
  status: string
  roleName: string
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

export default function ListUser() {
  const { searchQuery } = useContext(SearchContext)!
  const [activeButton, setActiveButton] = useState('resident')
  const [listUser, setListUser] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName)
    const filtered = listUser.filter((user: User) => user.roleName.toLowerCase() === buttonName.toLowerCase())
    setFilteredUsers(filtered)
  }
  const getAllUserMutation = useMutation({
    mutationFn: async () => {
      const response = await getAllUser()
      setListUser(response.data)
      // Set initial filtered users as residents
      const filtered = response.data.filter((user: User) => user.roleName.toLowerCase() === 'resident')
      setFilteredUsers(filtered)
    },
    onSuccess: (data) => {
      console.log('Danh sách cư dân thành công:', data)
    },
    onError: (error) => {
      console.error('Lỗi khi hiển thị danh sách cư dân:', error)
    }
  })
  useEffect(() => {
    getAllUserMutation.mutate()
    console.log('list: ', listUser)
  }, [])

  const handleDelete = (id: string) => {
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
          deleteUser(id) // Gọi API xóa user
          Swal.fire('Deleted!', 'The user has been successfully deleted.', 'success')
          // Cập nhật danh sách user (nếu bạn lưu users trong state)
          setListUser(listUser.filter((user) => user.id !== id))
        } catch (error) {
          Swal.fire('Error!', 'Unable to delete the user!', 'error')
          console.error('Error deleting user:', error)
        }
      }
    })
  }

  const handleGetUser = (id: string) => {
    window.location.href = `/admin/edit-user?userId=${id}`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-200 text-green-800'
      case 'inactive':
        return 'bg-red-200 text-red-800'
      default:
        return ''
    }
  }

  //Search user
  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.trim() === '') {
        setFilteredUsers(listUser)
      } else {
        try {
          const response = await searchUser(searchQuery)
          setFilteredUsers(response.data)
        } catch (error) {
          console.error('Lỗi khi tìm kiếm:', error)
        }
      }
    }
    fetchUsers()
  }, [searchQuery, listUser])



  return (
    <div className='bg-[#EDF2F9] pt-25 z-13 h-screen'>
      <div className='grid grid-cols-12 gap-5 items-start'>
        <div className='col-span-1'></div>
        <div className='col-span-2 sticky top-25'>
          <SideBarAdmin />
        </div>
        <div className='col-span-8'>
          <div className='flex gap-4 mb-6 justify-end font-bold '>
            <Button
              variant={activeButton === 'resident' ? 'contained' : 'outlined'}
              onClick={() => handleButtonClick('resident')}
            >
              Resident
            </Button>
            <Button
              variant={activeButton === 'manager' ? 'contained' : 'outlined'}
              onClick={() => handleButtonClick('manager')}
            >
              Manager
            </Button>
            <Button
              variant={activeButton === 'support_team' ? 'contained' : 'outlined'}
              onClick={() => handleButtonClick('support_team')}
            >
              Support Team
            </Button>
          </div>
          <Paper elevation={4}>
            <TableContainer>
              <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell width='5%'>Id</StyledTableCell>
                    <StyledTableCell width='25%'>Full Name</StyledTableCell>
                    <StyledTableCell width='12%'>Date of birth</StyledTableCell>
                    <StyledTableCell width='12%'>Gender</StyledTableCell>
                    <StyledTableCell width='12%'>Apartment</StyledTableCell>
                    <StyledTableCell width='14%'>Phone number</StyledTableCell>
                    <StyledTableCell width='10%'>Status</StyledTableCell>
                    <StyledTableCell width='8%'>Edit</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <StyledTableRow key={user.id}>
                        <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>{index + 1}</StyledTableCell>
                        <StyledTableCell>{user.fullName}</StyledTableCell>
                        <StyledTableCell>
                          {new Intl.DateTimeFormat('vi-VN').format(new Date(user.dateOfBirth))}
                        </StyledTableCell>
                        <StyledTableCell>{user.gender}</StyledTableCell>
                        <StyledTableCell>{user.apartmentNumber}</StyledTableCell>
                        <StyledTableCell>{user.phoneNumber}</StyledTableCell>
                        <StyledTableCell>
                          <span
                            className={`${getStatusColor(user.status)} px-2 py-1 rounded-full text-sm font-semibold`}
                          >
                            {user.status}
                          </span>
                        </StyledTableCell>
                        <StyledTableCell>
                          <div className='flex gap-2'>
                            <button
                              className='text-blue-500 cursor-pointer'
                              onClick={() => {
                                handleGetUser(user.id)
                              }}
                            >
                              <EditIcon />
                            </button>
                            <button
                              className='text-red-500 cursor-pointer'
                              onClick={() => {
                                handleDelete(user.id)
                              }}
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align='center'>
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <div className='col-span-1'></div>
        </div>
      </div>
    </div>
  )
}
