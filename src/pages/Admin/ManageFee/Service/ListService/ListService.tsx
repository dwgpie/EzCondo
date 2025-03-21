import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { Link } from 'react-router-dom'
import SideBarAdmin from '~/components/SideBar/SideBarAdmin/SideBarAdminActive'
import DeleteIcon from '@mui/icons-material/Delete'
import Switch from '@mui/material/Switch'

interface Service {
  id: number
  name: string
  description: string
  serviceType: string
  imageUrl: string
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

const services: Service[] = [
  {
    id: 1,
    name: 'Fitness Center',
    imageUrl: 'anh',
    description:
      'The gym in the apartment complex is a modern and well-equipped fitness center designed for residents. The gym offers a clean and comfortable environment, with air conditioning and ample lighting. Residents can enjoy a convenient space for exercise, whether for cardio, strength training, or stretching.',
    serviceType: 'utility'
  },
  {
    id: 2,
    name: 'Swimming Pool',
    description:
      'The swimming pool in the apartment complex is a well-maintained and relaxing facility for residents. It features a spacious design with clean, clear water, suitable for both leisure and exercise. The pool area includes seating and shaded spots for relaxation.',
    serviceType: 'utility',
    imageUrl: 'path/to/swimming-pool.jpg'
  },
  {
    id: 2,
    name: 'Swimming Pool',
    description:
      'The swimming pool in the apartment complex is a well-maintained and relaxing facility for residents. It features a spacious design with clean, clear water, suitable for both leisure and exercise. The pool area includes seating and shaded spots for relaxation.',
    serviceType: 'utility',
    imageUrl: 'path/to/swimming-pool.jpg'
  }
]

const label = { inputProps: { 'aria-label': 'Size switch demo' } }

export default function ListService() {
  return (
    <div className='bg-[#EDF2F9] pt-10 ml-10 mr-10 z-13 h-screen'>
      <Link to='/admin/add-service'>
        <Button variant='contained'>
          <AddIcon />
        </Button>{' '}
      </Link>
      <Paper elevation={4}>
        <TableContainer>
          <Table aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='5%'>Id</StyledTableCell>
                <StyledTableCell width='15%'>Name</StyledTableCell>
                <StyledTableCell width='20%'>Image</StyledTableCell>
                <StyledTableCell width='45%'>Description</StyledTableCell>
                <StyledTableCell width='10%'>Status</StyledTableCell>
                <StyledTableCell sx={{}}>Edit</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service, index) => (
                <StyledTableRow key={service.id}>
                  <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>{index + 1}</StyledTableCell>
                  <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>{service.name}</StyledTableCell>
                  <StyledTableCell>
                    {' '}
                    <img src='/public/imgs/avt/avatar-vo-tri-meo-1.jpg' className='w-40 h-35 object-cover rounded-sm' />
                  </StyledTableCell>
                  <StyledTableCell sx={{ textAlign: 'justify' }}>{service.description}</StyledTableCell>
                  <StyledTableCell>
                    {' '}
                    <Switch {...label} defaultChecked color='success' />
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className='flex gap-2'>
                      <button
                        className='text-blue-500 cursor-pointer'
                        // onClick={() => {
                        //   handleGetUser(user.id)
                        // }}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className='text-red-500 cursor-pointer'
                        // onClick={() => {
                        //   handleDelete(user.id)
                        // }}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
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
