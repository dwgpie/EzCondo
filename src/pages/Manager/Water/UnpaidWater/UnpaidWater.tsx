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
import { getAllWater, filterWater } from '~/apis/service.api'
import { Button, MenuItem, Select, Checkbox } from '@mui/material'
import { toast } from 'react-toastify'
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface WaterForm {
  id?: string
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

export default function UnpaidWater() {
  const navigate = useNavigate()
  const { t } = useTranslation('electricManager')
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const [filteredWaters, setFilteredWaters] = useState<WaterForm[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 7
  const totalPages = Math.ceil(filteredWaters.length / pageSize)
  const [status, setStatus] = useState<string>('false')
  const [day, setDay] = useState<string>('')
  const [selectedApartments, setSelectedApartments] = useState<string[]>([])

  const getAllWaterRecords = useMutation({
    mutationFn: async () => {
      setLoading(true)
      const response = await getAllWater()
      return response.data
    },
    onSuccess: (data) => {
      // Sort data by readingCurrentDate in descending order
      const sortedData = [...data].sort(
        (a, b) => new Date(b.readingCurrentDate).getTime() - new Date(a.readingCurrentDate).getTime()
      )
      setFilteredWaters(sortedData)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  })
  useEffect(() => {
    getAllWaterRecords.mutate()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await filterWater({
        status,
        day
      })
      // Sort filtered data by readingCurrentDate in descending order
      const sortedData = [...res.data].sort(
        (a, b) => new Date(b.readingCurrentDate).getTime() - new Date(a.readingCurrentDate).getTime()
      )
      setFilteredWaters(sortedData)
      setPage(1)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

    fetchData()
  }, [status, day])

  const paginatedWater = filteredWaters.slice((page - 1) * pageSize, page * pageSize)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-gradient-to-r from-green-200 to-green-300 text-green-700 font-semibold rounded-lg shadow-sm'
      case 'pending':
        return 'bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-700 font-semibold rounded-lg shadow-sm'
      case 'overdue':
        return 'bg-gradient-to-r from-red-200 to-red-300 text-red-700 font-semibold rounded-lg shadow-sm'
    }
  }

  // Modify handleCheckboxChange to also track selected apartments
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
      title: t('notification_title_water'),
      content: t('notification_content_water', { date: currentDate })
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
        <h2 className='text-2xl font-semibold text-gray-500'>{t('water_bill_paid_or_unpaid')}</h2>
        <div className='mt-2 mb-4 flex gap-4 justify-end items-center'>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSendNotification}
            disabled={selectedApartments.length === 0}
            sx={{ width: '200px' }}
          >
            {t('send_notification')} ({selectedApartments.length})
          </Button>
          <div>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} sx={{ width: '150px', height: '40px' }}>
              <MenuItem value='false'>{t('unpaid')}</MenuItem>
              <MenuItem value='true'>{t('paid')}</MenuItem>
            </Select>
          </div>
          <div>
            <Select
              value={day}
              onChange={(e) => setDay(e.target.value === 'All' ? '' : e.target.value)}
              sx={{ width: '200px', height: '40px' }}
              displayEmpty
              renderValue={(selected) => {
                if (selected === '' || selected === 'All') return t('all')
                return t('more_than_days', { days: selected })
              }}
            >
              <MenuItem value='All'>{t('all')}</MenuItem>
              <MenuItem value='1'>{t('more_than_days', { days: 1 })}</MenuItem>
              <MenuItem value='2'>{t('more_than_days', { days: 2 })}</MenuItem>
              <MenuItem value='10'>{t('more_than_days', { days: 10 })}</MenuItem>
              <MenuItem value='15'>{t('more_than_days', { days: 15 })}</MenuItem>
            </Select>
          </div>
        </div>
      </div>
      <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='1%'>{t('select')}</StyledTableCell>
                <StyledTableCell width='2%'>{t('id')}</StyledTableCell>
                <StyledTableCell width='16%'>{t('name')}</StyledTableCell>
                <StyledTableCell width='16%'>{t('apartment_number')}</StyledTableCell>
                <StyledTableCell width='11%'>{t('phone')}</StyledTableCell>
                <StyledTableCell width='17%'>{t('reading_pre_date')}</StyledTableCell>
                <StyledTableCell width='17%'>{t('reading_current_date')}</StyledTableCell>
                <StyledTableCell width='8%'>{t('consumption')}</StyledTableCell>
                <StyledTableCell width='8%'>{t('status')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedWater.length > 0 ? (
                paginatedWater.map((water, index) => (
                  <StyledTableRow key={`${water.fullName}-${index}`}>
                    <StyledTableCell>
                      <Checkbox
                        checked={selectedApartments.includes(water.apartmentNumber)}
                        onChange={() => handleCheckboxChange(water.apartmentNumber)}
                      />
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 600 }}>{(page - 1) * pageSize + index + 1}</StyledTableCell>
                    <StyledTableCell>{water.fullName}</StyledTableCell>
                    <StyledTableCell>{water.apartmentNumber}</StyledTableCell>
                    <StyledTableCell>{water.phoneNumber}</StyledTableCell>
                    <StyledTableCell>
                      {new Intl.DateTimeFormat('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }).format(new Date(water.readingPreDate))}
                    </StyledTableCell>
                    <StyledTableCell>
                      {new Intl.DateTimeFormat('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }).format(new Date(water.readingCurrentDate))}
                    </StyledTableCell>
                    <StyledTableCell>{water.consumption}</StyledTableCell>
                    <StyledTableCell>
                      <span
                        className={`${getStatusColor(
                          water.status
                        )} px-3 py-1.5 rounded-full text-sm font-semibold capitalize`}
                      >
                        {water.status}
                      </span>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align='center'>
                    {t('no_waters_found')}
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
