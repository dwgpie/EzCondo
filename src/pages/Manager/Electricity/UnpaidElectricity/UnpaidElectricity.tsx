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
import { useTranslation } from 'react-i18next'
import { addNotificationToResident, addNotificationImages } from '~/apis/notification.api'
import { generateElectricityBillImage } from '~/helpers/generateElectricityBillImage'
import LoadingOverlay from '~/components/LoadingOverlay'

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
  meterNumber: string
  pre_electric_number: string
  current_electric_number: string
  price: string
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
  const { t, i18n } = useTranslation('electricManager')
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const [progress2, setProgress2] = useState(0)
  const [filteredElectrics, setFilteredElectrics] = useState<ElectricityForm[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 7
  const totalPages = Math.ceil(filteredElectrics.length / pageSize)
  const [status, setStatus] = useState<string>('')
  const [day, setDay] = useState<string>('')
  const [month, setMonth] = useState<string>('')
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
        day,
        month
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
  }, [status, day, month])

  const paginatedElectric = filteredElectrics.slice((page - 1) * pageSize, page * pageSize)

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

  const handleCheckboxChange = (apartmentNumber: string) => {
    setSelectedApartments((prev) => {
      if (prev.includes(apartmentNumber)) {
        return prev.filter((apt) => apt !== apartmentNumber)
      } else {
        return [...prev, apartmentNumber]
      }
    })
  }

  const handleSendNotification = async () => {
    if (selectedApartments.length !== 1) {
      if (selectedApartments.length > 1) {
        toast.error(t('only_one_apartment'), {
          style: { width: 'fit-content' }
        })
      }
      return
    }

    const apartmentNumber = selectedApartments[0]
    const electric = filteredElectrics.find((e) => e.apartmentNumber === apartmentNumber)
    if (!electric) {
      toast.error(t('apartment_not_found'), {
        style: { width: 'fit-content' }
      })
      return
    }

    try {
      setLoading(true)
      setProgress2(0)

      const Progress = setInterval(() => {
        setProgress2((prev) => {
          if (prev >= 90) {
            clearInterval(Progress)
            return prev
          }
          return prev + 4
        })
      }, 150)
      const imgData = await generateElectricityBillImage(electric.electricReadingId || '', t, i18n)
      const res = await addNotificationToResident([
        {
          title: t('notification_title'),
          content: t('notification_content', { date: new Date().toLocaleDateString('vi-VN') }),
          type: 'fee',
          apartmentNumber
        }
      ])
      const notificationId = res.data?.[0]
      if (notificationId) {
        const [meta, base64] = imgData.split(',')
        const mime = meta.match(/:(.*?);/)?.[1] || 'image/png'
        const bstr = atob(base64)
        const u8arr = Uint8Array.from(bstr, (c) => c.charCodeAt(0))
        const file = new File([u8arr], `hoa-don-dien-${apartmentNumber}.png`, { type: mime })
        await addNotificationImages({ NotificationId: notificationId, Image: [file] })
      }
      toast.success(t('success'), {
        style: { width: 'fit-content' }
      })
    } catch {
      toast.error(t('error'), {
        style: { width: 'fit-content' }
      })
    } finally {
      setProgress2(100)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  return (
    <div className='mx-5 mt-5 mb-5 px-6 pb-3 pt-3 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading &&
        (progress2 === 0 ? (
          <div className='w-full px-6 fixed top-2 left-0 z-50'>
            <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
          </div>
        ) : (
          <div className='absolute inset-0 z-50 bg-white bg-opacity-50 flex justify-center items-center'>
            <LoadingOverlay value={progress2} />
          </div>
        ))}
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-500'>{t('electricity_bill_paid_or_unpaid')}</h2>
        <div className='mt-2 mb-4 flex gap-4 justify-end items-center'>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSendNotification}
            disabled={selectedApartments.length === 0}
            sx={{ width: '195px' }}
          >
            {t('send_notification')} ({selectedApartments.length})
          </Button>
          <div>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{ width: '170px', height: '40px' }}
              displayEmpty
            >
              <MenuItem value=''>{t('all')}</MenuItem>
              <MenuItem value='false'>{t('unpaid')}</MenuItem>
              <MenuItem value='true'>{t('paid')}</MenuItem>
            </Select>
          </div>
          <div>
            <Select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              sx={{ width: '180px', height: '40px' }}
              displayEmpty
            >
              <MenuItem value=''>{t('all')}</MenuItem>
              <MenuItem value='1'>{t('more_than_day', { days: 1 })}</MenuItem>
              <MenuItem value='2'>{t('more_than_days', { days: 2 })}</MenuItem>
              <MenuItem value='10'>{t('more_than_days', { days: 10 })}</MenuItem>
              <MenuItem value='15'>{t('more_than_days', { days: 15 })}</MenuItem>
            </Select>
          </div>
          <div>
            <Select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              sx={{ width: '140px', height: '40px' }}
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
                <StyledTableCell width='1%'>{t('select')}</StyledTableCell>
                <StyledTableCell width='2%'>{t('id')}</StyledTableCell>
                <StyledTableCell width='16%'>{t('name')}</StyledTableCell>
                <StyledTableCell width='16%'>{t('apartment_number')}</StyledTableCell>
                <StyledTableCell width='11%'>{t('phone')}</StyledTableCell>
                <StyledTableCell width='19%'>{t('reading_pre_date')}</StyledTableCell>
                <StyledTableCell width='18%'>{t('reading_current_date')}</StyledTableCell>
                <StyledTableCell width='8%'>{t('consumption')}</StyledTableCell>
                <StyledTableCell width='10%'>{t('status')}</StyledTableCell>
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
                    {t('no_electrics_found')}
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
