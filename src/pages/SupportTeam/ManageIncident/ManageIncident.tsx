import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import SideBarSupportTeam from '~/components/SideBar/SideBarSupportTeam'

interface User {
  id: string
  name: string
  apartment: string
  title: string
  dateOfReport: string
  status: string
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Resolved':
      return 'bg-green-200 text-green-800'
    case 'In progress':
      return 'bg-orange-200 text-orange-800'
    case 'Unresolved':
      return 'bg-red-200 text-red-800'
    default:
      return ''
  }
}

export default function ManageIncident() {
  const users: User[] = [
    {
      id: '05023',
      name: 'Pham Minh Tuan',
      apartment: 'iAii58',
      title: 'For all the times that you rained on my parade',
      dateOfReport: '01/03/2023',
      status: 'Resolved'
    },
    {
      id: '05023',
      name: 'Pham Minh Tuan',
      apartment: 'iAii58',
      title: 'For all the times that you ',
      dateOfReport: '01/03/2023',
      status: 'In progress'
    },
    {
      id: '05023',
      name: 'Pham Minh Tuan',
      apartment: 'iAii58',
      title: 'For all the times that you rained on my parade',
      dateOfReport: '01/03/2023',
      status: 'Unresolved'
    },
    {
      id: '05023',
      name: 'Pham Minh Tuan',
      apartment: 'iAii58',
      title: 'For all the times that you rained on my parade',
      dateOfReport: '01/03/2023',
      status: 'Resolved'
    },
    {
      id: '05023',
      name: 'Pham Minh Tuan',
      apartment: 'iAii58',
      title: 'For all the times that you ',
      dateOfReport: '01/03/2023',
      status: 'In progress'
    },
    {
      id: '05023',
      name: 'Pham Minh Tuan',
      apartment: 'iAii58',
      title: 'For all the times that you rained on my parade',
      dateOfReport: '01/03/2023',
      status: 'Unresolved'
    }

    // Add more user data as needed
  ]

  return (
    <div className='bg-[#EDF2F9] pt-25 z-13 h-screen'>
      <div className='grid grid-cols-12 gap-5 items-start'>
        <div className='col-span-1'></div>
        <div className='col-span-2 sticky top-25'>
          <SideBarSupportTeam />
        </div>
        <div className='col-span-8'>
          <div className='flex justify-between items-center h-18 bg-white text-2xl font-semibold mb-5 px-6 drop-shadow-md rounded-xl'>
            <div className='text-2xl font-semibold'>List of Incidents</div>
            <div>
              <select className='p-1 text-sm border rounded bg-white mr-3.5'>
                <option value='0'>All</option>
                <option value='1'>Resolved</option>
                <option value='2'>In progress</option>
                <option value='3'>Unresolved</option>
              </select>
              <select className='p-1 text-sm border rounded bg-white'>
                <option value='0'>All</option>
                <option value='1'>Last 7 days</option>
                <option value='2'>Last 1 months</option>
                <option value='3'>Last 1 years</option>
              </select>
            </div>
          </div>

          <Paper elevation={4}>
            <TableContainer>
              <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Id</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Apartment</StyledTableCell>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell>Date of report</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Detail</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <StyledTableRow key={user.id}>
                      <StyledTableCell>{user.id}</StyledTableCell>
                      <StyledTableCell>{user.name}</StyledTableCell>
                      <StyledTableCell>{user.apartment}</StyledTableCell>
                      <StyledTableCell>{user.title}</StyledTableCell>
                      <StyledTableCell>{user.dateOfReport}</StyledTableCell>
                      <StyledTableCell>
                        <span className={`${getStatusColor(user.status)} px-2 py-1 rounded-full text-sm`}>
                          {user.status}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                        <div className='flex gap-2'>
                          <button className='text-blue-500 cursor-pointer'>
                            <FormatAlignJustifyIcon />
                          </button>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <div className='col-span-1'></div>
        </div>
      </div>
    </div>
  )
}
