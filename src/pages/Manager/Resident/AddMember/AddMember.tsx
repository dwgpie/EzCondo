import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import { getUserById } from '~/apis/user.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { addMemberSchema } from '~/utils/rules'
import { useForm } from 'react-hook-form'

import Swal from 'sweetalert2'
import { addOrUpdateMember, deleteMember, getHouseholdMember } from '~/apis/householdMember.api'
import Input from '~/components/Input'

interface User {
  id?: string
  apartmentNumber?: string
  fullName: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  no: string
  relationship: string
}
interface Resident {
  id: string
  apartmentNumber: string
  fullName: string
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

export default function AddMember() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<User>({
    resolver: yupResolver(addMemberSchema)
  })

  const [listMember, setListMember] = useState<User[]>([])
  const [resident, setResident] = useState<Resident | null>(null)
  const getUserIdFromURL = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('userId') // Đảm bảo đúng với cách truyền userId
  }

  const userId = getUserIdFromURL()
  const [apartmentNumber, setApartmentNumber] = useState<string>('')

  const getResident = useMutation({
    mutationFn: async () => {
      if (!userId) return
      const response = await getUserById(userId)
      setResident(response.data)
      setApartmentNumber(response.data.apartmentNumber)
    },
    onSuccess: (data) => {
      console.log('get resident thành công:', data)
    },
    onError: (error) => {
      console.error('Lỗi khi hiển thị danh sách cư dân:', error)
    }
  })

  const getMember = useMutation({
    mutationFn: async () => {
      if (!apartmentNumber) {
        console.log('không có apart')
        return
      }

      const response = await getHouseholdMember(apartmentNumber)
      setListMember(response.data)
    },
    onSuccess: (data) => {
      console.log('Danh sách cư dân thành công:', data)
    },
    onError: (error) => {
      console.error('Lỗi khi hiển thị danh sách cư dân:', error)
    }
  })

  useEffect(() => {
    if (userId) {
      getResident.mutate()
    }
  }, [userId])

  useEffect(() => {
    if (apartmentNumber) {
      getMember.mutate()
    }
  }, [apartmentNumber])

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Are you sure you want to delete?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          deleteMember(id) // Gọi API xóa user
          Swal.fire('Deleted!', 'The member has been successfully deleted.', 'success')
          // Cập nhật danh sách user (nếu bạn lưu users trong state)
          setListMember(listMember.filter((user) => user.id !== id))
        } catch (error) {
          Swal.fire('Error!', 'Unable to delete the member!', 'error')
          console.error('Error deleting user:', error)
        }
      }
    })
  }

  const handleCallAPI = async (formData: User) => {
    try {
      await addOrUpdateMember({
        apartmentNumber: apartmentNumber,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        no: formData.no,
        relationship: formData.relationship
      })
      toast.success('Member created successfully!', {
        style: { width: 'fit-content' }
      })
      getMember.mutate() // Refresh data after adding
    } catch (error: any) {
      toast(error.message, {
        style: { width: 'fit-content' }
      })
    }
  }

  // Xử lý submit form
  const onSubmit = handleSubmit((formData) => {
    handleCallAPI(formData)
  })

  return (
    <div style={{ height: 'calc(100vh - 80px)' }} className='bg-[#EDF1F9]  pt-5 ml-5 mr-5 z-13'>
      <div className=''>
        <div className=''>
          <div className='flex gap-[100px] w-full h-[60px] rounded-t-xl bg-[#94cde7] items-center '>
            <h2 className='text-[20px] text-[#344050] font-semibold ml-[24px]'>Name: {resident?.fullName}</h2>
            <h2 className='text-[20px] text-[#344050] font-semibold ml-[24px]'>Apartment: {apartmentNumber}</h2>
          </div>
          <Paper
            elevation={4}
            sx={{
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
              overflow: 'hidden'
            }}
          >
            <TableContainer>
              <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell width='5%'>Id</StyledTableCell>
                    <StyledTableCell width='15%'>Full Name</StyledTableCell>
                    <StyledTableCell width='10%'>Gender</StyledTableCell>
                    <StyledTableCell width='15%'>Date Of Birth</StyledTableCell>
                    <StyledTableCell width='15%'>Phone Number</StyledTableCell>
                    <StyledTableCell width='22%'>Citizen Identity Number</StyledTableCell>
                    <StyledTableCell width='15%'>Relationship</StyledTableCell>
                    <StyledTableCell width='5%'>Delete</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listMember.length > 0 ? (
                    listMember.map((user, index) => (
                      <StyledTableRow>
                        <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>{index + 1}</StyledTableCell>
                        <StyledTableCell>{user.fullName}</StyledTableCell>
                        <StyledTableCell>
                          <span className='capitalize'>{user.gender} </span>
                        </StyledTableCell>
                        <StyledTableCell>
                          {new Intl.DateTimeFormat('vi-VN').format(new Date(user.dateOfBirth))}
                        </StyledTableCell>
                        <StyledTableCell>{user.phoneNumber}</StyledTableCell>
                        <StyledTableCell>{user.no}</StyledTableCell>
                        <StyledTableCell>
                          <span className='capitalize'>{user.relationship} </span>
                        </StyledTableCell>
                        <StyledTableCell colSpan={1} align='center'>
                          <button
                            className=' cursor-pointer '
                            onClick={() => {
                              if (user.id) {
                                handleDelete(user.id)
                              }
                            }}
                          >
                            <DeleteIcon sx={{ color: 'red' }} />
                          </button>
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
        </div>
      </div>
      <div className='bg-[#fff] rounded-xl mb-[20px] shadow-lg pb-[20px] mt-7'>
        <form className='rounded' noValidate onSubmit={onSubmit}>
          <div className='flex pt-4 justify-between'>
            <div className='ml-[20px]'>
              <label className='block text-sm font-semibold my-2'>
                Name
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <Input
                name='fullName'
                type='text'
                register={register}
                className='mt-1'
                errorMessage={errors.fullName?.message}
              />
            </div>

            <div className=''>
              <label className='block text-sm font-semibold my-2'>
                Gender
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <select
                {...register('gender')}
                defaultValue='Male'
                className='w-26 h-11 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              >
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </select>
            </div>

            <div className=''>
              <label className='block text-sm font-semibold my-2'>
                Date of birth
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <Input
                name='dateOfBirth'
                type='date'
                register={register}
                className='mt-1 '
                errorMessage={errors.dateOfBirth?.message}
              />
            </div>

            <div className=''>
              <label className='block text-sm font-semibold my-2'>
                Phone number
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <Input
                name='phoneNumber'
                type='number'
                register={register}
                className='mt-1'
                errorMessage={errors.phoneNumber?.message}
              />
            </div>

            <div className=''>
              <label className='block text-sm font-semibold my-2'>
                Citizen Identity Number
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <Input name='no' type='number' register={register} className='mt-1' errorMessage={errors.no?.message} />
            </div>

            <div className='mr-[20px]'>
              <label className='block text-sm font-semibold my-2'>
                Relationship to household head
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <select
                {...register('relationship')}
                defaultValue='father'
                className=' w-full h-11 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              >
                <option value='father'>Father</option>
                <option value='mother'>Mother</option>
                <option value='wife'>Wife</option>
                <option value='son'>Son</option>
                <option value='daughter'>Daughter</option>
                <option value='relative'>Relative</option>
                <option value='grandchild'>Grandchild</option>
                <option value='tenant'>Tenant</option>
              </select>
            </div>
          </div>
          <div className='flex justify-end gap-4 mt-6 mr-[2%] '>
            <Button
              variant='contained'
              onClick={() => (window.location.href = '/manager/list-resident')}
              style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }} // Add this line
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              type='submit'
              style={{ color: 'white', fontWeight: 'semi-bold' }} // Add this line
            >
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
