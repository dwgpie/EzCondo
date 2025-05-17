import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { getAllService, searchService } from '~/apis/service.api'
import { useMutation } from '@tanstack/react-query'
import { useContext, useEffect, useRef, useState } from 'react'
import { Pagination } from '@mui/material'
import { SearchContext } from '~/contexts/SearchContext'
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
import { useTranslation } from 'react-i18next'

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
  const pageSize = 5
  const totalPages = Math.ceil(listService.length / pageSize)
  const { t } = useTranslation('service')

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
        return 'bg-gradient-to-r from-green-200 to-green-300 text-green-700 font-semibold rounded-lg shadow-sm'
      case 'inactive':
        return 'bg-gradient-to-r from-red-200 to-red-300 text-red-700 font-semibold rounded-lg shadow-sm'
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
    let isCurrent = true
    if (searchQuery.trim() === '') {
      setListService(originalList)
    } else {
      searchService(searchQuery)
        .then((response) => {
          if (isCurrent) setListService(response.data)
        })
        .catch((error) => {
          if (isCurrent) console.error('Error search:', error)
        })
    }
    return () => {
      isCurrent = false
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
        <h2 className='text-2xl font-semibold text-gray-500'>{t('service_list')}</h2>
      </div>
      <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='5%'>{t('id')}</StyledTableCell>
                <StyledTableCell width='17%'>{t('name')}</StyledTableCell>
                <StyledTableCell width='30%'>{t('description')}</StyledTableCell>
                <StyledTableCell width='13%'>{t('type_of_month')}</StyledTableCell>
                <StyledTableCell width='13%'>{t('type_of_year')}</StyledTableCell>
                <StyledTableCell width='9%'>{t('status')}</StyledTableCell>
                <StyledTableCell width='10%'>{t('edit')}</StyledTableCell>
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
                      <div className=''>
                        <button
                          type='button'
                          className='text-blue-500 cursor-pointer bg-blue-100 p-2 rounded-full'
                          onClick={() => handleGetService(service.id)}
                        >
                          <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24'>
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
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align='center'>
                    {t('no_services_found')}
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
