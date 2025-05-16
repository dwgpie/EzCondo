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
import { getAllUser, deleteUser, searchUser } from '~/apis/user.api'
import Swal from 'sweetalert2'
import { SearchContext } from '~/contexts/SearchContext'
import Pagination from '@mui/material/Pagination'
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
import { useTranslation } from 'react-i18next'

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
    fontFamily: '"Plus Jakarta Sans", sans-serif'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontFamily: '"Plus Jakarta Sans", sans-serif'
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
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const { searchQuery } = useContext(SearchContext)!
  const [activeButton, setActiveButton] = useState('resident')
  const [listUser, setListUser] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 5
  const totalPages = Math.ceil(filteredUsers.length / pageSize)
  const { t } = useTranslation('user')

  const handleButtonClick = (buttonName: string | string[]) => {
    setActiveButton(Array.isArray(buttonName) ? 'all' : buttonName)
    const filtered = Array.isArray(buttonName)
      ? listUser.filter(
          (user: User) =>
            ['resident', 'manager'].includes(user.roleName.toLowerCase()) && user.roleName.toLowerCase() !== 'admin'
        )
      : listUser.filter(
          (user: User) =>
            user.roleName.toLowerCase() === buttonName.toLowerCase() && user.roleName.toLowerCase() !== 'admin'
        )
    setFilteredUsers(filtered)
    setPage(1) // Reset về trang đầu tiên khi lọc
  }

  const getAllUserMutation = useMutation({
    mutationFn: async () => {
      setLoading(true)
      const response = await getAllUser()
      return response.data
    },
    onSuccess: (data) => {
      const filteredList = data.filter((user: User) => user.roleName.toLowerCase() !== 'admin')
      setListUser(filteredList)
      handleButtonClick(['resident', 'manager'])

      // Delay để progress có thời gian hiển thị
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    },
    onError: (error) => {
      console.error('Lỗi khi hiển thị danh sách cư dân:', error)
    }
  })

  useEffect(() => {
    getAllUserMutation.mutate()
    handleButtonClick(['resident', 'manager']) // Mặc định chọn ALL
    console.log('list: ', listUser)
  }, [])

  const handleDelete = (id: string) => {
    Swal.fire({
      title: t('delete_confirm_title'),
      text: t('delete_confirm_text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('delete'),
      cancelButtonText: t('cancel'),
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          deleteUser(id) // Gọi API xóa user
          Swal.fire(t('deleted'), t('user_deleted_success'), 'success')
          setListUser(listUser.filter((user) => user.id !== id))
        } catch (error) {
          Swal.fire('Error!', t('user_delete_fail'), 'error')
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
        return 'bg-gradient-to-r from-green-200 to-green-300 text-green-700 font-semibold rounded-lg shadow-sm'
      case 'inactive':
        return 'bg-gradient-to-r from-red-200 to-red-300 text-red-700 font-semibold rounded-lg shadow-sm'
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
          setFilteredUsers(response.data.filter((user: User) => user.roleName.toLowerCase() !== 'admin'))
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
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && (
        <div className='w-full px-6 fixed top-2 left-0 z-50'>
          <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
        </div>
      )}
      <div className='flex gap-4 mb-6 justify-between font-bold '>
        <h2 className='text-2xl font-semibold text-gray-500'>{t('user_list')}</h2>
        <div className='flex gap-4 justify-end'>
          <Button
            sx={{
              backgroundColor: activeButton === 'all' ? '#5382B1' : 'transparent',
              color: activeButton === 'all' ? '#fff' : '#5382B1',
              border: '1px solid #5382B1',
              borderRadius: '6px',
              width: '110px',
              height: '35px'
            }}
            onClick={() => handleButtonClick(['resident', 'manager'])}
          >
            {t('all')}
          </Button>
          <Button
            sx={{
              backgroundColor: activeButton === 'resident' ? '#5382B1' : 'transparent',
              color: activeButton === 'resident' ? '#fff' : '#5382B1',
              border: '1px solid #5382B1',
              borderRadius: '6px',
              width: '110px',
              height: '35px'
            }}
            onClick={() => handleButtonClick('resident')}
          >
            {t('resident')}
          </Button>
          <Button
            sx={{
              backgroundColor: activeButton === 'manager' ? '#5382B1' : 'transparent',
              color: activeButton === 'manager' ? '#fff' : '#5382B1',
              border: '1px solid #5382B1',
              borderRadius: '6px',
              width: '110px',
              height: '35px'
            }}
            onClick={() => handleButtonClick('manager')}
          >
            {t('manager')}
          </Button>
        </div>
      </div>
      <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='5%'>{t('id')}</StyledTableCell>
                <StyledTableCell width='20%'>{t('full_name')}</StyledTableCell>
                <StyledTableCell width='12%'>{t('date_of_birth')}</StyledTableCell>
                <StyledTableCell width='12%'>{t('gender')}</StyledTableCell>
                <StyledTableCell width='12%'>{t('apartment')}</StyledTableCell>
                <StyledTableCell width='15%'>{t('phone_number')}</StyledTableCell>
                <StyledTableCell width='10%'>{t('status')}</StyledTableCell>
                <StyledTableCell width='10%'>{t('edit')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <StyledTableRow key={user.id}>
                    <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>
                      {(page - 1) * pageSize + index + 1}
                    </StyledTableCell>
                    <StyledTableCell>{user.fullName}</StyledTableCell>
                    <StyledTableCell>
                      {new Intl.DateTimeFormat('vi-VN').format(new Date(user.dateOfBirth))}
                    </StyledTableCell>
                    <StyledTableCell>
                      <span className='capitalize'>{user.gender} </span>
                    </StyledTableCell>
                    <StyledTableCell>{user.apartmentNumber}</StyledTableCell>
                    <StyledTableCell>{user.phoneNumber}</StyledTableCell>
                    <StyledTableCell>
                      <span
                        className={`${getStatusColor(user.status)} px-2 py-1 rounded-full text-sm font-semibold capitalize`}
                      >
                        {user.status}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className='flex gap-1'>
                        <button
                          type='button'
                          className='text-blue-500 cursor-pointer bg-blue-100 p-2 rounded-full'
                          onClick={() => handleGetUser(user.id)}
                        >
                          <svg xmlns='http://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 24 24'>
                            <g
                              fill='none'
                              stroke='currentColor'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                            >
                              <path d='M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                              <path d='M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z' />
                            </g>
                          </svg>
                        </button>
                        <button
                          type='button'
                          className='text-red-500 cursor-pointer bg-red-100 p-2 rounded-full ml-2'
                          onClick={() => {
                            handleDelete(user.id)
                          }}
                        >
                          <svg xmlns='http://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 48 48'>
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
                          </svg>
                        </button>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align='center'>
                    {t('no_users_found')}
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
