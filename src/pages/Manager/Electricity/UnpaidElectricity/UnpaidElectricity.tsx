import { useEffect, useState } from 'react'
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
import { getAllElectric, filterElectric } from '~/apis/service.api'
import { Button, MenuItem, Select, Checkbox } from '@mui/material'
import { toast } from 'react-toastify'
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
import { useNavigate } from 'react-router-dom'

interface ElectricityForm {
  electricReadingId?: string
  email: string
  fullName: string
  apartmentNumber: string
  phoneNumber: string
  readingPreDate: string
  readingCurrentDate: string
  consumption: string
  status: string
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f4f4f5',
    color: theme.palette.common.black,
    fontWeight: 'bold',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    padding: '10px 12px'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    padding: '8px 12px'
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

export default function UnpaidElectricity() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const [filteredElectrics, setFilteredElectrics] = useState<ElectricityForm[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 7
  const totalPages = Math.ceil(filteredElectrics.length / pageSize)
  const [status, setStatus] = useState<string>('false')
  const [day, setDay] = useState<string>('All')
  const [selectedApartments, setSelectedApartments] = useState<string[]>([])

  const getAllElectricityRecords = useMutation({
    mutationFn: async () => {
      setLoading(true)
      const response = await getAllElectric()
      return response.data
    },
    onSuccess: (data) => {
      // Sort data by readingCurrentDate in descending order
      const sortedData = [...data].sort(
        (a, b) => new Date(b.readingCurrentDate).getTime() - new Date(a.readingCurrentDate).getTime()
      )
      setFilteredElectrics(sortedData)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  })
  useEffect(() => {
    getAllElectricityRecords.mutate()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await filterElectric({
        status,
        day
      })
      // Sort filtered data by readingCurrentDate in descending order
      const sortedData = [...res.data].sort(
        (a, b) => new Date(b.readingCurrentDate).getTime() - new Date(a.readingCurrentDate).getTime()
      )
      setFilteredElectrics(sortedData)
      setPage(1)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

    fetchData()
  }, [status, day])

  const paginatedElectric = filteredElectrics.slice((page - 1) * pageSize, page * pageSize)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500 text-white'
      case 'pending':
        return 'bg-orange-500 text-white'
      case 'overdue':
        return 'bg-red-500 text-white'
    }
  }

  const handleCheckboxChange = (apartmentNumber: string) => {
    setSelectedApartments((prev) => {
      if (prev.includes(apartmentNumber)) {
        return prev.filter((apt) => apt !== apartmentNumber)
      } else {
        return [...prev, apartmentNumber]
      }
    })
  }

  const handleSendNotification = () => {
    if (selectedApartments.length === 0) {
      toast.warning('Please select at least one apartment', {
        style: { width: 'fit-content' }
      })
      return
    }

    const currentDate = new Date().toLocaleDateString('vi-VN')
    const notificationData = {
      selectedApartments,
      title: 'Thông Báo Trễ Hạn Thanh Toán Tiền Điện',
      content: `Kính gửi Quý cư dân,\n\nChúng tôi xin thông báo rằng hóa đơn tiền Điện của căn hộ Quý vị hiện vẫn chưa được thanh toán. Quý cư dân vui lòng hoàn tất việc thanh toán trong thời gian sớm nhất để tránh gián đoạn dịch vụ.\n\nNgày thông báo: ${currentDate}\n\nTrân trọng,\nBan Quản Lý Tòa Nhà.`
    }

    navigate('/manager/add-notification', { state: notificationData })
  }

  return (
    <div className='mx-5 mt-5 mb-5 px-6 pb-3 pt-3 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && (
        <div className='w-full px-6 fixed top-2 left-0 z-50'>
          <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
        </div>
      )}
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-500'>Electricity bill paid or unpaid</h2>
        <div className='mt-2 mb-4 flex gap-4 justify-end items-center'>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSendNotification}
            disabled={selectedApartments.length === 0}
            sx={{ width: '200px' }}
          >
            Send Notification ({selectedApartments.length})
          </Button>
          <div>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} sx={{ width: '150px', height: '40px' }}>
              <MenuItem value='false'>Unpaid</MenuItem>
              <MenuItem value='true'>Paid</MenuItem>
            </Select>
          </div>
          <div>
            <Select
              value={day}
              onChange={(e) => setDay(e.target.value === 'All' ? '' : e.target.value)}
              sx={{ width: '200px', height: '40px' }}
              displayEmpty
              renderValue={(selected) => {
                if (selected === '' || selected === 'All') return 'All'
                return `More than ${selected} days`
              }}
            >
              <MenuItem value='All'>All</MenuItem>
              <MenuItem value='1'>More than 1 days</MenuItem>
              <MenuItem value='2'>More than 2 days</MenuItem>
              <MenuItem value='10'>More than 10 days</MenuItem>
              <MenuItem value='15'>More than 15 days</MenuItem>
            </Select>
          </div>
        </div>
      </div>
      <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='1%'>Select</StyledTableCell>
                <StyledTableCell width='2%'>ID</StyledTableCell>
                <StyledTableCell width='16%'>Name</StyledTableCell>
                <StyledTableCell width='16%'>Apartment Number</StyledTableCell>
                <StyledTableCell width='10%'>Phone</StyledTableCell>
                <StyledTableCell width='17%'>Reading Pre Date</StyledTableCell>
                <StyledTableCell width='17%'>Reading Current Date</StyledTableCell>
                <StyledTableCell width='8%'>Consumption</StyledTableCell>
                <StyledTableCell width='1%'>Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedElectric.length > 0 ? (
                paginatedElectric.map((electric, index) => (
                  <StyledTableRow key={`${electric.fullName}-${index}`}>
                    <StyledTableCell>
                      <Checkbox
                        checked={selectedApartments.includes(electric.apartmentNumber)}
                        onChange={() => handleCheckboxChange(electric.apartmentNumber)}
                      />
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 600 }}>{(page - 1) * pageSize + index + 1}</StyledTableCell>
                    <StyledTableCell>{electric.fullName}</StyledTableCell>
                    <StyledTableCell>{electric.apartmentNumber}</StyledTableCell>
                    <StyledTableCell>{electric.phoneNumber}</StyledTableCell>
                    <StyledTableCell>
                      {new Intl.DateTimeFormat('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }).format(new Date(electric.readingPreDate))}
                    </StyledTableCell>
                    <StyledTableCell>
                      {new Intl.DateTimeFormat('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }).format(new Date(electric.readingCurrentDate))}
                    </StyledTableCell>
                    <StyledTableCell>{electric.consumption}</StyledTableCell>
                    <StyledTableCell>
                      <span
                        className={`${getStatusColor(
                          electric.status
                        )} px-3 py-1.5 rounded-full text-sm font-semibold capitalize`}
                      >
                        {electric.status}
                      </span>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align='center'>
                    No electrics found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <div className='flex justify-center mt-5'>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} />
      </div>
    </div>
  )
}
