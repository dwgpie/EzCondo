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
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Link } from 'react-router-dom'
import SideBarAdmin from '~/components/SideBar/SideBarAdmin'
import { getAllUser } from '~/apis/auth.api'

interface User {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  apartment: string
  phoneNumber: string
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

export default function ListUser() {
  const [activeButton, setActiveButton] = useState('Resident')
  const [listUser, setListUser] = useState<User[]>([])

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName)
  }
  const getAllUserMutation = useMutation({
    mutationFn: async () => {
      // console.log('data:', response.data)

      // getAllUser()
      // return response.data
      const response = await getAllUser()
      setListUser(response.data)
    },
    onSuccess: (data) => {
      console.log('Danh sách cư dân thành công:', data)
    },
    onError: (error) => {
      console.error('Lỗi khi hiển thị danh sách cư dân:', error)
    }
  })
  useEffect(() => {
    getAllUserMutation.mutate()
    console.log('list: ', listUser)
  }, [])

  // const users: User[] = [
  //   {
  //     id: '05023',
  //     name: 'Pham Minh Tuan',
  //     dateOfBirth: '01/03/2023',
  //     gender: 'Male',
  //     apartment: 'iAii58',
  //     phoneNumber: '0847628516',
  //     status: 'Active'
  //   },
  //   {
  //     id: '05023',
  //     name: 'Pham Minh Tuan',
  //     dateOfBirth: '01/03/2023',
  //     gender: 'Male',
  //     apartment: 'iAii58',
  //     phoneNumber: '0847628516',
  //     status: 'Active'
  //   },
  //   {
  //     id: '05023',
  //     name: 'Pham Minh Tuan',
  //     dateOfBirth: '01/03/2023',
  //     gender: 'Male',
  //     apartment: 'iAii58',
  //     phoneNumber: '0847628516',
  //     status: 'Active'
  //   },
  //   {
  //     id: '05023',
  //     name: 'Pham Minh Tuan',
  //     dateOfBirth: '01/03/2023',
  //     gender: 'Male',
  //     apartment: 'iAii58',
  //     phoneNumber: '0847628516',
  //     status: 'Active'
  //   },
  //   {
  //     id: '05023',
  //     name: 'Pham Minh Tuan',
  //     dateOfBirth: '01/03/2023',
  //     gender: 'Male',
  //     apartment: 'iAii58',
  //     phoneNumber: '0847628516',
  //     status: 'Active'
  //   }
  //   // Add more user data as needed
  // ]

  return (
    <div className='bg-[#EDF2F9] pt-25 z-13 h-screen'>
      <div className='grid grid-cols-12 gap-5 items-start'>
        <div className='col-span-1'></div>
        <div className='col-span-2 sticky top-25'>
          <SideBarAdmin />
        </div>
        <div className='col-span-8'>
          <div className='flex justify-between items-center h-18 bg-white text-2xl font-semibold mb-5 px-6 drop-shadow-md rounded-xl'>
            <div className='text-2xl font-semibold'>List of Users</div>
            <Link to='/admin/add-user'>
              <Button variant='contained'>
                <AddIcon />
              </Button>{' '}
            </Link>
          </div>
          <div className='flex gap-4 mb-6 justify-end font-bold '>
            <Button
              variant={activeButton === 'Resident' ? 'contained' : 'outlined'}
              onClick={() => handleButtonClick('Resident')}
            >
              Resident
            </Button>
            <Button
              variant={activeButton === 'Manager' ? 'contained' : 'outlined'}
              onClick={() => handleButtonClick('Manager')}
            >
              Manager
            </Button>
            <Button
              variant={activeButton === 'Support Team' ? 'contained' : 'outlined'}
              onClick={() => handleButtonClick('Support Team')}
            >
              Support Team
            </Button>
          </div>
          <Paper elevation={4}>
            <TableContainer>
              <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Id</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Date of birth</StyledTableCell>
                    <StyledTableCell>Gender</StyledTableCell>
                    <StyledTableCell>Apartment</StyledTableCell>
                    <StyledTableCell>Phone number</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Edit</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listUser?.map((user) => (
                    <StyledTableRow key={user.id}>
                      <StyledTableCell>{user.id.slice(-5).toUpperCase()}</StyledTableCell>
                      <StyledTableCell>{user.name}</StyledTableCell>
                      <StyledTableCell>{user.dateOfBirth}</StyledTableCell>
                      <StyledTableCell>{user.gender}</StyledTableCell>
                      <StyledTableCell>{user.apartment}</StyledTableCell>
                      <StyledTableCell>{user.phoneNumber}</StyledTableCell>
                      <StyledTableCell>
                        <span className='bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm'>
                          {user.status}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell>
                        <div className='flex gap-2'>
                          <button className='text-blue-500 cursor-pointer'>
                            <EditIcon />
                          </button>
                          <button className='text-red-500 cursor-pointer'>
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
          <div className='col-span-1'></div>
        </div>
      </div>
    </div>
  )
}
