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
import { getUserById } from '~/apis/user.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { addMemberSchema } from '~/utils/rules'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { addOrUpdateMember, deleteMember, getHouseholdMember } from '~/apis/householdMember.api'
import Input from '~/components/Input'
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
import { useTranslation } from 'react-i18next'

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

export default function AddMember() {
  const { t } = useTranslation('resident')
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<User>({
    resolver: yupResolver(addMemberSchema)
  })
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
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
      setLoading(true)
      if (!userId) return
      const response = await getUserById(userId)
      setResident(response.data)
      setApartmentNumber(response.data.apartmentNumber)
    },
    onSuccess: (data) => {
      console.log('get resident thành công:', data)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
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
      title: t('delete_confirm_title'),
      text: t('delete_confirm_text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('delete'),
      cancelButtonText: t('cancel'),
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          deleteMember(id) // Gọi API xóa user
          Swal.fire(t('delete_success'), '', 'success')
          setListMember(listMember.filter((user) => user.id !== id))
        } catch (error) {
          Swal.fire(t('delete_error'), '', 'error')
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
      toast.success(t('success_add'), {
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
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && (
        <div className='w-full px-6 fixed top-2 left-0 z-50'>
          <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
        </div>
      )}
      <div>
        <div className='flex gap-[100px] w-full h-[60px] rounded-t-xl bg-[#94cde7] items-center '>
          <h2 className='text-[20px] text-[#344050] font-semibold ml-[24px]'>
            {t('name')}: {resident?.fullName}
          </h2>
          <h2 className='text-[20px] text-[#344050] font-semibold ml-[24px]'>
            {t('apartment')}: {apartmentNumber}
          </h2>
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
                  <StyledTableCell width='5%'>{t('id')}</StyledTableCell>
                  <StyledTableCell width='15%'>{t('full_name')}</StyledTableCell>
                  <StyledTableCell width='10%'>{t('gender')}</StyledTableCell>
                  <StyledTableCell width='15%'>{t('date_of_birth')}</StyledTableCell>
                  <StyledTableCell width='15%'>{t('phone_number')}</StyledTableCell>
                  <StyledTableCell width='22%'>{t('citizen_id')}</StyledTableCell>
                  <StyledTableCell width='15%'>{t('relationship')}</StyledTableCell>
                  <StyledTableCell width='5%'></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listMember.length > 0 ? (
                  listMember.map((user, index) => (
                    <StyledTableRow key={user.id}>
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
                      <StyledTableCell>
                        <button
                          type='button'
                          className='text-red-500 cursor-pointer bg-red-100 p-1.5 rounded-full'
                          onClick={() => {
                            if (user.id) {
                              handleDelete(user.id)
                            }
                          }}
                        >
                          <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 48 48'>
                            <defs>
                              <mask id='ipTDelete0'>
                                <g fill='none' stroke='#fff' strokeLinejoin='round' strokeWidth='4'>
                                  <path fill='#555555' d='M9 10v34h30V10z' />
                                  <path strokeLinecap='round' d='M20 20v13m8-13v13M4 10h40' />
                                  <path fill='#555555' d='m16 10l3.289-6h9.488L32 10z' />
                                </g>
                              </mask>
                            </defs>
                            <path fill='currentColor' d='M0 0h48v48H0z' mask='url(#ipTDelete0)' />
                          </svg>
                        </button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align='center'>
                      {t('no_users_found')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>

      <div className='bg-[#fff] rounded-xl mb-[20px] shadow-lg pb-[20px] mt-7'>
        <form className='rounded' noValidate onSubmit={onSubmit}>
          <div className='flex pt-4 justify-between'>
            <div className='ml-[20px]'>
              <label className='block text-sm font-semibold my-2'>
                {t('full_name')}
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
                {t('gender')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <select
                {...register('gender')}
                defaultValue='Male'
                className='w-26 h-11 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              >
                <option value='male'>{t('male')}</option>
                <option value='female'>{t('female')}</option>
                <option value='other'>{t('other')}</option>
              </select>
            </div>

            <div className=''>
              <label className='block text-sm font-semibold my-2'>
                {t('date_of_birth')}
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
                {t('phone_number')}
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
                {t('citizen_id')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <Input name='no' type='number' register={register} className='mt-1' errorMessage={errors.no?.message} />
            </div>

            <div className='mr-[20px]'>
              <label className='block text-sm font-semibold my-2'>
                {t('relationship_to_head')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <select
                {...register('relationship')}
                defaultValue='father'
                className=' w-full h-11 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              >
                <option value='father'>{t('father')}</option>
                <option value='mother'>{t('mother')}</option>
                <option value='wife'>{t('wife')}</option>
                <option value='son'>{t('son')}</option>
                <option value='daughter'>{t('daughter')}</option>
                <option value='relative'>{t('relative')}</option>
                <option value='grandchild'>{t('grandchild')}</option>
                <option value='tenant'>{t('tenant')}</option>
              </select>
            </div>
          </div>
          <div className='flex justify-end gap-4 mt-6 mr-[2%] '>
            <Button
              variant='contained'
              onClick={() => (window.location.href = '/manager/list-resident')}
              style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }}
            >
              {t('cancel')}
            </Button>
            <Button variant='contained' type='submit' style={{ color: 'white', fontWeight: 'semi-bold' }}>
              {t('add')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
