import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { filterNotificationManager } from '~/apis/notification.api'
import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Pagination,
  Select,
  TextField
} from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
import { useTranslation } from 'react-i18next'

interface FormData {
  id?: string
  title: string
  content: string
  type: string
  receiver: string
  createdAt: string
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

export default function HistoryNotificationManager() {
  const { t } = useTranslation('notification')
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const [listNotification, setListNotification] = useState<FormData[]>([])
  const [type, setType] = useState('new')
  const [day, setDay] = useState(3)
  const [page, setPage] = useState(1)
  const pageSize = 6
  const [openEditDialog, setOpenEditDialog] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await filterNotificationManager({
        receiver: '',
        type,
        day
      })
      setListNotification(res.data.notifications)
      setPage(1) // reset lại page về 1 khi lọc
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

    fetchData()
  }, [type, day])

  const totalPages = Math.ceil(listNotification.length / pageSize)
  const paginatedNotify = listNotification.slice((page - 1) * pageSize, page * pageSize)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const [notify, setNotify] = useState<FormData | null>(null)

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
  }

  const handleEditClick = async (item: FormData) => {
    setNotify(item)
    setOpenEditDialog(true)
  }

  return (
    <div className='mx-5 mt-5 mb-5 px-6 py-6 pt-4 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && (
        <div className='w-full px-6 fixed top-2 left-0 z-50'>
          <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
        </div>
      )}
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-500'>{t('notification_history')}</h2>
        <div className='mt-2 mb-4 flex gap-4 justify-end'>
          <div>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value === 'all' ? '' : e.target.value)}
              sx={{ width: '200px', height: '40px' }}
              displayEmpty
              renderValue={(selected) => (selected === '' ? t('all') : t(selected))}
            >
              <MenuItem value=''>{t('all')}</MenuItem>
              <MenuItem value='new'>{t('new')}</MenuItem>
              <MenuItem value='notice'>{t('notice')}</MenuItem>
              <MenuItem value='fee'>{t('fee')}</MenuItem>
            </Select>
          </div>
          <div>
            <Select
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              sx={{ width: '200px', height: '40px' }}
            >
              <MenuItem value={3}>{t('last_3_days')}</MenuItem>
              <MenuItem value={7}>{t('last_7_days')}</MenuItem>
            </Select>
          </div>
        </div>
      </div>
      <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='5%'>{t('id')}</StyledTableCell>
                <StyledTableCell width='22%'>{t('title')}</StyledTableCell>
                <StyledTableCell width='30%'>{t('content')}</StyledTableCell>
                <StyledTableCell width='12%'>{t('date_created')}</StyledTableCell>
                <StyledTableCell width='13%'>{t('type_of_notification')}</StyledTableCell>
                <StyledTableCell width='10%'>{t('receiver')}</StyledTableCell>
                <StyledTableCell width='10%'>{t('detail')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedNotify.length > 0 ? (
                paginatedNotify.map((notify, index) => (
                  <StyledTableRow key={notify.id}>
                    <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>
                      {(page - 1) * pageSize + index + 1}
                    </StyledTableCell>
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
                      {notify.title}
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
                      {notify.content}
                    </StyledTableCell>
                    <StyledTableCell>
                      {new Intl.DateTimeFormat('vi-VN').format(new Date(notify.createdAt))}
                    </StyledTableCell>
                    <StyledTableCell>{notify.type}</StyledTableCell>
                    <StyledTableCell>{notify.receiver}</StyledTableCell>
                    <StyledTableCell>
                      <div className='ml-2'>
                        <button
                          className='text-blue-500 cursor-pointer'
                          onClick={() => {
                            handleEditClick(notify)
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
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align='center'>
                    {t('no_notifications_found')}
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
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} disableEnforceFocus disableRestoreFocus>
        <DialogTitle sx={{ color: '#1976d3', fontWeight: 'bold', fontSize: '22px' }}>
          {t('detail_notification')}
        </DialogTitle>
        <DialogContent>
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-4'>
              <label className='block text-sm font-semibold'>{t('type_of_notification')}</label>
              <TextField type='text' sx={{ marginTop: '-13px' }} value={notify?.type} disabled fullWidth />
            </div>
            <div className='flex flex-col gap-4'>
              <label className='block text-sm font-semibold'>{t('receiver')}</label>
              <TextField type='text' sx={{ marginTop: '-13px' }} value={notify?.receiver} disabled fullWidth />
            </div>
          </div>
          <div className='flex flex-col gap-4 mt-3'>
            <label className='block text-sm font-semibold'>{t('title')}</label>
            <TextField
              type='text'
              sx={{ marginTop: '-13px' }}
              value={notify?.title}
              disabled
              fullWidth
              multiline
              minRows={2}
              maxRows={8}
            />
          </div>
          <div className='flex flex-col gap-4 mt-3'>
            <label className='block text-sm font-semibold'>{t('content')}</label>
            <TextField
              type='text'
              sx={{ marginTop: '-13px' }}
              value={notify?.content}
              disabled
              fullWidth
              multiline
              minRows={3}
              maxRows={8}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>{t('cancel')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
