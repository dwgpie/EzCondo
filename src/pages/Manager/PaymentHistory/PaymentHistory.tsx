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
import Pagination from '@mui/material/Pagination'
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
import { getAllPayment, getAllPaymentSearch } from '~/apis/service.api'
import { useTranslation } from 'react-i18next'
import { MenuItem, Select } from '@mui/material'
import { SearchContext } from '~/contexts/SearchContext'

interface Payment {
  id?: string
  fullName: string
  apartmentNumber: string
  type: string
  amount: number
  createDate: string
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

export default function PaymentHistory() {
  const { t } = useTranslation('booking')
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const { searchQuery } = useContext(SearchContext)!
  const [listPayment, setListPayment] = useState<Payment[]>([])
  const [originalList, setOriginalList] = useState<Payment[]>([]) // Lưu danh sách gốc
  const [page, setPage] = useState(1)
  const pageSize = 6
  const [month, setMonth] = useState('')

  const getAllPaymentMutation = useMutation({
    mutationFn: async () => {
      setLoading(true)
      const response = await getAllPayment(month)
      return response.data
    },
    onSuccess: (data) => {
      setListPayment(data)
      setOriginalList(data) // Lưu danh sách gốc
      setPage(1)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    },
    onError: (error) => {
      console.error(error)
    }
  })

  useEffect(() => {
    getAllPaymentMutation.mutate()
  }, [month])

  useEffect(() => {
    const fetchInitialPayments = async () => {
      try {
        const response = await getAllPayment(month) // API lấy tất cả dịch vụ
        setListPayment(response.data)
        setOriginalList(response.data) // Lưu danh sách gốc
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }
    fetchInitialPayments()
  }, [])

  useEffect(() => {
    let isCurrent = true
    if (searchQuery.trim() === '') {
      setListPayment(originalList)
    } else {
      getAllPaymentSearch(searchQuery)
        .then((response) => {
          if (isCurrent) setListPayment(response.data)
        })
        .catch((error) => {
          if (isCurrent) console.error('Error search:', error)
        })
    }
    return () => {
      isCurrent = false
    }
  }, [searchQuery, originalList])

  // Hàm lấy user theo trang hiện tại
  const totalPages = Math.ceil(listPayment.length / pageSize)
  const paginatedPayments = listPayment.slice((page - 1) * pageSize, page * pageSize)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className='mx-5 mt-5 mb-5 p-6 pt-4 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && (
        <div className='w-full px-6 fixed top-2 left-0 z-50'>
          <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
        </div>
      )}
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-500'>{t('payment_history')}</h2>
        <div className='mt-2 mb-4 flex gap-4 justify-end items-center'>
          <div>
            <Select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              sx={{ width: '180px', height: '40px' }}
              displayEmpty
            >
              <MenuItem value=''>{t('all')}</MenuItem>
              <MenuItem value='1'>{t('month1')}</MenuItem>
              <MenuItem value='2'>{t('month2')}</MenuItem>
              <MenuItem value='3'>{t('month3')}</MenuItem>
              <MenuItem value='4'>{t('month4')}</MenuItem>
              <MenuItem value='5'>{t('month5')}</MenuItem>
              <MenuItem value='6'>{t('month6')}</MenuItem>
              <MenuItem value='7'>{t('month7')}</MenuItem>
              <MenuItem value='8'>{t('month8')}</MenuItem>
              <MenuItem value='9'>{t('month9')}</MenuItem>
              <MenuItem value='10'>{t('month10')}</MenuItem>
              <MenuItem value='11'>{t('month11')}</MenuItem>
              <MenuItem value='12'>{t('month12')}</MenuItem>
            </Select>
          </div>
        </div>
      </div>

      <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='3%'>{t('id')}</StyledTableCell>
                <StyledTableCell width='15%'>{t('full_name')}</StyledTableCell>
                <StyledTableCell width='8%'>{t('apartment')}</StyledTableCell>
                <StyledTableCell width='13%'>{t('type')}</StyledTableCell>
                <StyledTableCell width='10%'>{t('amount')}</StyledTableCell>
                <StyledTableCell width='16%'>{t('payment_date')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment, index) => (
                  <StyledTableRow key={payment.id}>
                    <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>
                      {(page - 1) * pageSize + index + 1}
                    </StyledTableCell>
                    <StyledTableCell>{payment.fullName}</StyledTableCell>
                    <StyledTableCell>{payment.apartmentNumber}</StyledTableCell>
                    <StyledTableCell>{payment.type}</StyledTableCell>
                    <StyledTableCell>{Number(payment.amount).toLocaleString('en-US')}</StyledTableCell>
                    <StyledTableCell>
                      {new Intl.DateTimeFormat('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }).format(new Date(payment.createDate))}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align='center'>
                    {t('no_payments_found')}
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
