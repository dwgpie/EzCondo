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
import SubjectIcon from '@mui/icons-material/Subject'

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

export default function HistoryNotificationManager() {
  const [listNotification, setListNotification] = useState<FormData[]>([])
  const [type, setType] = useState('new')
  const [day, setDay] = useState(7)
  const [page, setPage] = useState(1)
  const pageSize = 5
  const [openEditDialog, setOpenEditDialog] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await filterNotificationManager({
        receiver: '',
        type,
        day
      })
      setListNotification(res.data.notifications)
      setPage(1) // reset lại page về 1 khi lọc
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
    <div className='pt-5 mx-5 z-13' style={{ height: 'calc(100vh - 80px)' }}>
      <div className='mb-6 p-6 bg-white drop-shadow-md rounded-xl'>
        <div className='flex  justify-between items-center'>
          <div>
            <h1 className='font-extrabold text-[30px] text-[#333]'>History Notification</h1>
          </div>
          <div className='mt-2 mb-4 flex gap-4 justify-end'>
            <div>
              <Select
                value={type} // Giá trị thực tế là ""
                onChange={(e) => setType(e.target.value === 'all' ? '' : e.target.value)}
                sx={{ width: '200px' }}
                displayEmpty
                renderValue={(selected) => (selected === '' ? 'All' : selected)}
              >
                <MenuItem value=''>All</MenuItem>
                <MenuItem value='new'>New</MenuItem>
                <MenuItem value='notice'>Notice</MenuItem>
                <MenuItem value='fee'>Fee</MenuItem>
              </Select>
            </div>
            <div>
              <Select value={day} onChange={(e) => setDay(Number(e.target.value))} sx={{ width: '200px' }}>
                <MenuItem value={7}>Fewer than 7 days</MenuItem>
                <MenuItem value={10}>More than 7 days</MenuItem>
              </Select>
            </div>
          </div>
        </div>
        <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <TableContainer>
            <Table aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell width='5%'>Id</StyledTableCell>
                  <StyledTableCell width='25%'>Title</StyledTableCell>
                  <StyledTableCell width='33%'>Content</StyledTableCell>
                  <StyledTableCell width='13%'>Date created</StyledTableCell>
                  <StyledTableCell width='15%'>Tyoe of notification</StyledTableCell>
                  <StyledTableCell width='10%'>Receiver</StyledTableCell>
                  <StyledTableCell>Detail</StyledTableCell>
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
                        <div className='flex gap-2 ml-2'>
                          <button className='text-blue-500 cursor-pointer' onClick={() => handleEditClick(notify)}>
                            <SubjectIcon />
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
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} disableEnforceFocus disableRestoreFocus>
          <DialogTitle sx={{ color: '#1976d3', fontWeight: 'bold', fontSize: '22px' }}>Detail notification</DialogTitle>
          <DialogContent>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-4'>
                <label className='block text-sm font-semibold'>Type of notification</label>
                <TextField type='text' sx={{ marginTop: '-13px' }} value={notify?.type} disabled fullWidth />
              </div>
              <div className='flex flex-col gap-4'>
                <label className='block text-sm font-semibold'>Receiver</label>
                <TextField type='text' sx={{ marginTop: '-13px' }} value={notify?.receiver} disabled fullWidth />
              </div>
            </div>
            <div className='flex flex-col gap-4 mt-3'>
              <label className='block text-sm font-semibold'>Title</label>
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
              <label className='block text-sm font-semibold'>Content</label>
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
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}
