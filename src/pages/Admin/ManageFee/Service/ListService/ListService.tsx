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
import { Link } from 'react-router-dom'
import { getAllService, searchUser } from '~/apis/auth.api'
import { useMutation } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import { Pagination } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { SearchContext } from '~/components/Search/SearchContext'

interface FormData {
  id: string
  serviceName: string
  description: string
  typeOfMonth: boolean
  typeOfYear: boolean
  priceOfMonth?: number | null
  priceOfYear?: number | null
  status: string
  serviceImages: File[]
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

export default function ListService() {
  const { searchQuery } = useContext(SearchContext)!
  const [listService, setListService] = useState<FormData[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 5
  const totalPages = Math.ceil(listService.length / pageSize)

  const getAllServiceMutation = useMutation({
    mutationFn: async () => {
      const response = await getAllService()
      setListService(response.data)
      return response.data
    },
    onSuccess: (data) => {
      console.log('Success vc:', data)
    },
    onError: (error) => {
      console.error('Error:', error)
    }
  })
  useEffect(() => {
    getAllServiceMutation.mutate()
  }, [])

  const handleGetService = (id: string) => {
    window.location.href = `/admin/edit-service?serviceId=${id}`
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

  //Search service
  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.trim() === '') {
        setListService(listService)
      } else {
        try {
          const response = await searchUser(searchQuery)
          setListService(response.data)
        } catch (error) {
          console.error('Error search:', error)
        }
      }
    }
    fetchUsers()
  }, [searchQuery, listService])

  // Hàm lấy service theo trang hiện tại
  const paginatedUsers = listService.slice((page - 1) * pageSize, page * pageSize)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className='bg-[#EDF2F9] pt-5 ml-5 mr-5 z-13 h-screen'>
      <Link to='/admin/add-service'>
        <div className='mb-5 flex item-center justify-end'>
          <Button
            sx={{
              backgroundColor: '#5382B1',
              color: '#fff',
              border: '1px solid #5382B1',
              borderRadius: '6px',
              width: '160px',
              height: '40px'
            }}
          >
            <AddBoxIcon sx={{ fontSize: 30 }} />
            <p className='ml-3 font-bold'>Add Service</p>
          </Button>
        </div>
      </Link>
      <Paper elevation={4}>
        <TableContainer>
          <Table aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='5%'>Id</StyledTableCell>
                <StyledTableCell width='15%'>Name</StyledTableCell>
                <StyledTableCell width='30%'>Description</StyledTableCell>
                <StyledTableCell width='15%'>Type of Month</StyledTableCell>
                <StyledTableCell width='15%'>Type of Year</StyledTableCell>
                <StyledTableCell width='10%'>Status</StyledTableCell>
                <StyledTableCell sx={{}}>Edit</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((service, index) => (
                  <StyledTableRow key={service.id}>
                    <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>{index + 1}</StyledTableCell>
                    <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>{service.serviceName}</StyledTableCell>
                    <StyledTableCell sx={{ textAlign: 'justify' }}>{service.description}</StyledTableCell>
                    <StyledTableCell>{service.priceOfMonth}</StyledTableCell>
                    <StyledTableCell>{service.priceOfYear}</StyledTableCell>
                    <StyledTableCell>
                      <span
                        className={`${getStatusColor(service.status)} px-2 py-1 rounded-full text-sm font-semibold`}
                      >
                        {service.status}
                      </span>{' '}
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className='flex gap-2'>
                        <button
                          className='text-blue-500 cursor-pointer'
                          onClick={() => {
                            handleGetService(service.id)
                          }}
                        >
                          <EditIcon />
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
      <div className='mt-10 flex justify-center'>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} />
      </div>
    </div>
  )
}
