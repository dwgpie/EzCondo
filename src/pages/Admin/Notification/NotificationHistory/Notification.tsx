import { useState } from 'react'

import { Autocomplete, Box, Button, styled, TextField } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import ListAltIcon from '@mui/icons-material/ListAlt'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import DeleteIcon from '@mui/icons-material/Delete'
import { Link } from 'react-router-dom'
import SideBarAdmin from '~/components/SideBar/SideBarAdmin'
import zIndex from '@mui/material/styles/zIndex'

interface Notification {
  id: string
  title: string
  content: string
  dateOfIssue: string
  typeOfNotification: string
  receiver: string
}

interface AutocompleteOption {
  label: string
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f4f4f5',
    color: theme.palette.common.black,
    fontWeight: 'bold',
    fontFamily: 'Sans-serif'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontFamily: 'Sans-serif'
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

export default function Notification() {
  const [activeButton, setActiveButton] = useState('Resident')

  const [typeOfNotification, setTypeOfNotification] = useState('')
  const [filterTime, setFilterTime] = useState('')

  const notification: Notification[] = [
    {
      id: 'assda',
      title: 'Thông báo tiền điện',
      content: 'Bạn đã quá hạn đóng phí điện 15 ngày, nếu ...',
      dateOfIssue: '28/02/2035',
      typeOfNotification: 'Thông báo phí',
      receiver: 'ADSA2'
    },
    {
      id: 'assdb',
      title: 'Thông báo tiền điện',
      content: 'Bạn đã quá hạn đóng phí điện 15 ngày, nếu ...',
      dateOfIssue: '28/02/2035',
      typeOfNotification: 'Thông báo phí',
      receiver: 'All'
    }
  ]

  function handleButtonRole(buttonName: string) {
    setActiveButton(buttonName)
  }

  const handleFilterTypeOfNoti = (event: SelectChangeEvent) => {
    setTypeOfNotification(event.target.value)
  }
  const handleFilterTime = (event: SelectChangeEvent) => {
    setFilterTime(event.target.value)
  }
  return (
    <div className='bg-[#EDF2F9] pt-10 ml-10 mr-10 z-13'>
      <div className='flex justify-between items-center h-18  text-2xl font-semibold mb-5 px-6 drop-shadow-md rounded-xl z-10'>
        <div className='text-2xl font-semibold'>Notification History</div>
        <div className='flex gap-[20px] item-center'>
          <div className='h-[40px] w-[190px] bg-white rounded-[5px]'>
            <FormControl sx={{ minWidth: '190px' }} size='small'>
              <InputLabel sx={{}} id='demo-select-small-label'>
                Type of notification
              </InputLabel>
              <Select
                labelId='demo-select-small-label'
                id='demo-select-small'
                value={typeOfNotification}
                label='Type of notification'
                onChange={handleFilterTypeOfNoti}
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Thông báo phí</MenuItem>
                <MenuItem value={20}>Thông báo chung</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className='h-[40px] w-[190px] bg-white rounded-[5px]'>
            <FormControl sx={{ minWidth: '190px' }} size='small'>
              <InputLabel sx={{}} id='demo-select-small-label'>
                All
              </InputLabel>
              <Select
                labelId='demo-select-small-label'
                id='demo-select-small'
                value={typeOfNotification}
                label='Type of notification'
                onChange={handleFilterTime}
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={7}>Latest 7 days</MenuItem>
                <MenuItem value={30}>May</MenuItem>
                <MenuItem value={30}>April</MenuItem>
                <MenuItem value={30}>March</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <Link to='/admin/create-notification'>
          <Button variant='contained'>
            <AddIcon />
          </Button>{' '}
        </Link>
      </div>
      <div className='flex gap-4 mb-6 justify-end font-bold z-0'>
        <Button
          sx={{ zIndex: 0 }}
          variant={activeButton === 'Resident' ? 'contained' : 'outlined'}
          onClick={() => handleButtonRole('Resident')}
        >
          Resident
        </Button>
        <Button
          variant={activeButton === 'Manager' ? 'contained' : 'outlined'}
          onClick={() => handleButtonRole('Manager')}
        >
          Manager
        </Button>
        <Button
          variant={activeButton === 'Support Team' ? 'contained' : 'outlined'}
          onClick={() => handleButtonRole('Support Team')}
        >
          Support Team
        </Button>
      </div>
      <Paper elevation={4}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Content</StyledTableCell>
                <StyledTableCell>Date of issue</StyledTableCell>
                <StyledTableCell>Type of notification</StyledTableCell>
                <StyledTableCell>receiver</StyledTableCell>
                <StyledTableCell>Edit</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notification.map((noti) => (
                <StyledTableRow key={noti.id}>
                  <StyledTableCell>{noti.title}</StyledTableCell>
                  <StyledTableCell>{noti.content}</StyledTableCell>
                  <StyledTableCell>{noti.dateOfIssue}</StyledTableCell>
                  <StyledTableCell>{noti.typeOfNotification}</StyledTableCell>
                  <StyledTableCell>{noti.receiver}</StyledTableCell>
                  <StyledTableCell>
                    <Link to='/admin/add-user'>
                      <button className='cursor-pointer'>
                        <ListAltIcon sx={{ color: 'black' }} />
                      </button>
                    </Link>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  )
}
