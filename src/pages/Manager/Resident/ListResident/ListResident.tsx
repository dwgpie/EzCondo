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
import { getAllResident, searchResident } from '~/apis/householdMember.api'
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

export default function ListResident() {
  const { t } = useTranslation('resident')
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const { searchQuery } = useContext(SearchContext)!
  const [listUser, setListUser] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])

  const [page, setPage] = useState(1)
  const pageSize = 6
  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  const getAllUserMutation = useMutation({
    mutationFn: async () => {
      setLoading(true)
      const response = await getAllResident()
      return response.data
    },
    onSuccess: (data) => {
      setListUser(data)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
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
          const response = await searchResident(searchQuery)
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
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && (
        <div className='w-full px-6 fixed top-2 left-0 z-50'>
          <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
        </div>
      )}
      <div className='mb-[20px]'>
        <h2 className='text-2xl font-semibold text-gray-500'>{t('resident_list')}</h2>
      </div>
      <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='3%'>{t('id')}</StyledTableCell>
                <StyledTableCell width='20%'>{t('full_name')}</StyledTableCell>
                <StyledTableCell width='10%'>{t('date_of_birth')}</StyledTableCell>
                <StyledTableCell width='10%'>{t('gender')}</StyledTableCell>
                <StyledTableCell width='7%'>{t('apartment')}</StyledTableCell>
                <StyledTableCell width='12%'>{t('phone_number')}</StyledTableCell>
                <StyledTableCell width='8%'>{t('status')}</StyledTableCell>
                <StyledTableCell width='7%'>{t('detail')}</StyledTableCell>
                <StyledTableCell width='12%'>{t('add_member')}</StyledTableCell>
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
                    <StyledTableCell>
                      <span className='capitalize'>{user.gender}</span>
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
                      <div className=''>
                        <button
                          className='text-blue-500 cursor-pointer ml-3'
                          onClick={() => {
                            handleDetail(user.id)
                          }}
                        >
                          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 48 48'>
                            <g fill='none' stroke='currentColor' strokeLinejoin='round' strokeWidth='4'>
                              <rect width='36' height='36' x='6' y='6' rx='3' />
                              <path d='M13 13h8v8h-8z' />
                              <path strokeLinecap='round' d='M27 13h8m-8 7h8m-22 8h22m-22 7h22' />
                            </g>
                          </svg>
                        </button>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <button
                        className='text-gray-500 cursor-pointer ml-8'
                        onClick={() => {
                          handleAddMember(user.id)
                        }}
                      >
                        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                          <path
                            fill='currentColor'
                            d='M14 14.252V22H4a8 8 0 0 1 10-7.748M12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6m6 4v-3h2v3h3v2h-3v3h-2v-3h-3v-2z'
                          />
                        </svg>
                      </button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align='center'>
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
