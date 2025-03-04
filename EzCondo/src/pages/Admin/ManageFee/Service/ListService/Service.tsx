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
import SideBarAdmin from '~/components/SideBar/SideBarAdmin/SideBarAdmin'

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

export default function Service() {
  return (
    <div className='bg-[#EDF2F9] pt-25 z-13 h-screen'>
      <div className='grid grid-cols-12 gap-5 items-start'>
        <div className='col-span-1'></div>
        <div className='col-span-2 sticky top-25'>
          <SideBarAdmin />
        </div>
        <div className='col-span-8'>
          <div className='flex justify-between items-center h-18 bg-white text-2xl font-semibold mb-5 px-6 drop-shadow-md rounded-xl'>
            <div className='text-2xl font-semibold'>List of Services</div>
            <Link to='/admin/add-user'>
              <Button variant='contained'>
                <AddIcon />
              </Button>{' '}
            </Link>
          </div>
          <Paper elevation={4}>
            <TableContainer>
              <Table aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ minWidth: '140px' }}>Name</StyledTableCell>
                    <StyledTableCell sx={{ minWidth: '150px' }}>Image</StyledTableCell>
                    <StyledTableCell sx={{ minWidth: '420px' }}>Description</StyledTableCell>
                    <StyledTableCell sx={{ minWidth: '120px' }}>Service type</StyledTableCell>
                    <StyledTableCell sx={{}}>Edit</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((service) => (
                    <StyledTableRow key={service.id}>
                      <StyledTableCell>{service.name}</StyledTableCell>
                      <StyledTableCell>
                        {' '}
                        <img src='/public/imgs/avt/avatar-vo-tri-meo-1.jpg' className='w-30 h-30 object-cover' />
                      </StyledTableCell>
                      <StyledTableCell>{service.description}</StyledTableCell>
                      <StyledTableCell>{service.serviceType}</StyledTableCell>
                      <StyledTableCell>
                        <button className='text-blue-500 cursor-pointer'>
                          <EditIcon />
                        </button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
        <div className='col-span-1'></div>
      </div>
    </div>
  )
}
