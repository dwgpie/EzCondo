import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import EditIcon from '@mui/icons-material/Edit'
import { getAllService, searchService } from '~/apis/service.api'
import { useMutation } from '@tanstack/react-query'
import { useContext, useEffect, useRef, useState } from 'react'
import { Pagination } from '@mui/material'
import { SearchContext } from '~/contexts/SearchContext'
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
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

export default function ListService() {
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const { searchQuery } = useContext(SearchContext)!
  const [listService, setListService] = useState<FormData[]>([])
  const [originalList, setOriginalList] = useState<FormData[]>([]) // Lưu danh sách gốc
  const [page, setPage] = useState(1)
  const pageSize = 6
  const totalPages = Math.ceil(listService.length / pageSize)

  const getAllServiceMutation = useMutation({
    mutationFn: async () => {
      setLoading(true)
      const response = await getAllService()
      return response.data
    },
    onSuccess: (data) => {
      setListService(data)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    },
    onError: (error) => {
      console.error('Error:', error)
    }
  })

  // Lưu mutate vào useRef
  const mutateRef = useRef(getAllServiceMutation.mutate)

  useEffect(() => {
    mutateRef.current() // Gọi mutate từ ref để tránh dependency issue
  }, [])

  const handleGetService = (id: string) => {
    window.location.href = `/admin/edit-service?serviceId=${id}`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500 text-white'
      case 'inactive':
        return 'bg-red-500 text-white'
      default:
        return ''
    }
  }

  //Search service
  useEffect(() => {
    const fetchInitialServices = async () => {
      try {
        const response = await getAllService() // API lấy tất cả dịch vụ
        setListService(response.data)
        setOriginalList(response.data) // Lưu danh sách gốc
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }
    fetchInitialServices()
  }, [])

  // Xử lý tìm kiếm
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setListService(originalList) // Trả về danh sách ban đầu khi xoá tìm kiếm
    } else {
      searchService(searchQuery)
        .then((response) => setListService(response.data))
        .catch((error) => console.error('Error search:', error))
    }
  }, [searchQuery, originalList])

  // Hàm lấy service theo trang hiện tại
  const paginatedUsers = listService.slice((page - 1) * pageSize, page * pageSize)

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
        <h2 className='text-2xl font-semibold text-gray-500'>List Services</h2>
      </div>
      <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='5%'>ID</StyledTableCell>
                <StyledTableCell width='15%'>Name</StyledTableCell>
                <StyledTableCell width='30%'>Description</StyledTableCell>
                <StyledTableCell width='15%'>Type Of Month</StyledTableCell>
                <StyledTableCell width='15%'>Type Of Year</StyledTableCell>
                <StyledTableCell width='13%'>Status</StyledTableCell>
                <StyledTableCell sx={{}}>Edit</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((service, index) => (
                  <StyledTableRow key={service.id}>
                    <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>{index + 1}</StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: 'black',
                        fontWeight: '600',
                        textAlign: 'justify',
                        maxWidth: 50,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {service.serviceName}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        textAlign: 'justify',
                        maxWidth: 50,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {service.description}
                    </StyledTableCell>
                    <StyledTableCell>{service.priceOfMonth?.toLocaleString('en-US')}</StyledTableCell>
                    <StyledTableCell>{service.priceOfYear?.toLocaleString('en-US')}</StyledTableCell>
                    <StyledTableCell>
                      <span
                        className={`${getStatusColor(service.status)} px-2 py-1 rounded-full text-sm font-semibold capitalize`}
                      >
                        {service.status}
                      </span>
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
                    No services found
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
