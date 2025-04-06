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
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { getAllUser, searchUser } from '~/apis/user.api'
import Swal from 'sweetalert2'
import { SearchContext } from '~/components/Search/SearchContext'
import Pagination from '@mui/material/Pagination'

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

export default function ListResident() {
  const { searchQuery } = useContext(SearchContext)!
  const [listUser, setListUser] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])

  const [page, setPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  const getAllUserMutation = useMutation({
    mutationFn: async () => {
      const response = await getAllUser()
      setListUser(response.data)
      //   setListUser(response.data.filter((user: User) => user.roleName.toLowerCase() === 'resident'))
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

  const handleDetail = (id: string) => {
    window.location.href = `/manager/detail-resident?userId=${id}`
  }
  const handleAddMember = (id: string) => {
    window.location.href = `/manager/add-member?userId=${id}`
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
          console.error('Error search:', error)
        }
      }
    }
    fetchUsers()
  }, [searchQuery, listUser])

  // Hàm lấy user theo trang hiện tại
  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className='bg-[#EDF2F9] pt-5 ml-5 mr-5 z-13 h-screen'>
      <Paper elevation={4}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='5%'>Id</StyledTableCell>
                <StyledTableCell width='20%'>Full Name</StyledTableCell>
                <StyledTableCell width='12%'>Date of birth</StyledTableCell>
                <StyledTableCell width='10%'>Gender</StyledTableCell>
                <StyledTableCell width='12%'>Apartment</StyledTableCell>
                <StyledTableCell width='13%'>Phone number</StyledTableCell>
                <StyledTableCell width='10%'>Status</StyledTableCell>
                <StyledTableCell width='7%'>Detail</StyledTableCell>
                <StyledTableCell width='10%'>Add member</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
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
                      <span className={`${getStatusColor(user.status)} px-2 py-1 rounded-full text-sm font-semibold`}>
                        {user.status}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell>
                      <button
                        className='text-blue-500 cursor-pointer'
                        onClick={() => {
                          handleDetail(user.id)
                        }}
                      >
                        <EditIcon />
                      </button>
                    </StyledTableCell>
                    <StyledTableCell>
                      <button
                        className=' cursor-pointer'
                        onClick={() => {
                          handleAddMember(user.id)
                        }}
                      >
                        <PersonAddIcon />
                      </button>
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
      <div className='mt-10 flex justify-center'>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} />
      </div>
    </div>
  )
}
