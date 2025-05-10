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
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
import { getParkingById, deleteParkingLot, updateParkingLot } from '~/apis/service.api'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { Button, DialogContent, DialogTitle, Dialog } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Parking {
  parkingId: string
  id: string
  type: string
  status: string
  checking: string
  price: number
}

interface EditParking {
  parkingLotDetailId: string
  status: string
  checking: string
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

export default function DetailParking() {
  const { register, handleSubmit, setValue } = useForm<EditParking>({})
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const [listParkingDetail, setListParkingDetail] = useState<Parking[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 6
  const totalPages = Math.ceil(listParkingDetail.length / pageSize)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<EditParking | null>(null)
  const { t } = useTranslation('parkingManager')

  const geParkingIdFromURL = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('parkingLotId')
  }

  const parkingLotId = geParkingIdFromURL()

  const getAllParkingMutation = useMutation({
    mutationFn: async (parkingId: string) => {
      setLoading(true)
      const response = await getParkingById(parkingId)
      return response.data
    },
    onSuccess: (data) => {
      setListParkingDetail(data)

      setTimeout(() => {
        setLoading(false)
      }, 1000)
    },
    onError: (error) => {
      console.error(error)
    }
  })

  useEffect(() => {
    if (parkingLotId) {
      getAllParkingMutation.mutate(parkingLotId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parkingLotId])

  // Hàm lấy user theo trang hiện tại
  const paginatedUsers = listParkingDetail.slice((page - 1) * pageSize, page * pageSize)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-gradient-to-r from-green-200 to-green-300 text-green-700 font-semibold rounded-lg shadow-sm'
      case 'pending':
        return 'bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-700 font-semibold rounded-lg shadow-sm'
      case 'inactive':
        return 'bg-gradient-to-r from-red-200 to-red-300 text-red-700 font-semibold rounded-lg shadow-sm'
    }
  }

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
          deleteParkingLot(id)
          Swal.fire('Deleted!', 'The ticket has been successfully deleted.', 'success')
          setListParkingDetail(listParkingDetail.filter((parking) => parking.id !== id))
        } catch (error) {
          Swal.fire('Error!', 'Unable to delete the ticket!', 'error')
          console.error('Error deleting user:', error)
        }
      }
    })
  }

  const handleEditClick = (id: string) => {
    const item = listParkingDetail.find((parking) => parking.id === id)
    if (item) {
      // Chuyển đổi giá trị về 'true'/'false' cho select
      const statusValue = item.status === 'active' ? 'true' : 'false'
      const checkingValue = item.checking === 'Check in' ? 'true' : 'false'
      const editData: EditParking = {
        parkingLotDetailId: item.id,
        status: statusValue,
        checking: checkingValue
      }
      setEditingItem(editData)
      setValue('parkingLotDetailId', editData.parkingLotDetailId)
      setValue('status', statusValue)
      setValue('checking', checkingValue)
      setOpenEditDialog(true)
    }
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
    setEditingItem(null)
  }

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setLoading(true)
      await updateParkingLot({
        parkingLotDetailId: editingItem?.parkingLotDetailId ?? '',
        status: formData.status === 'true',
        checking: formData.checking === 'true'
      })
      toast.success('Service updated successfully!', {
        style: { width: 'fit-content' }
      })
      setOpenEditDialog(false)
      setEditingItem(null)
      // Refresh data
      if (parkingLotId) getAllParkingMutation.mutate(parkingLotId)
    } catch (error) {
      console.error('API call failed:', error)
    } finally {
      setLoading(false)
    }
  })

  return (
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && (
        <div className='w-full px-6 fixed top-2 left-0 z-50'>
          <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
        </div>
      )}
      <div className='flex gap-4 mb-6 justify-between font-bold '>
        <h2 className='text-2xl font-semibold text-gray-500'>{t('parking_list') + ' ' + t('detail')}</h2>
      </div>
      <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='5%'>{t('id')}</StyledTableCell>
                <StyledTableCell width='15%'>{t('type')}</StyledTableCell>
                <StyledTableCell width='15%'>{t('checking')}</StyledTableCell>
                <StyledTableCell width='15%'>{t('status')}</StyledTableCell>
                <StyledTableCell width='15%'>{t('price')}</StyledTableCell>
                <StyledTableCell width='8%'>{t('edit')}</StyledTableCell>
                <StyledTableCell width='1%'></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((parking, index) => (
                  <StyledTableRow key={parking.id}>
                    <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>
                      {(page - 1) * pageSize + index + 1}
                    </StyledTableCell>
                    <StyledTableCell>
                      <span className='capitalize'>{parking.type} </span>
                    </StyledTableCell>
                    <StyledTableCell>
                      <span className='capitalize'>{parking.checking} </span>
                    </StyledTableCell>
                    <StyledTableCell>
                      <span
                        className={`${getStatusColor(
                          parking.status
                        )} px-3 py-1.5 rounded-full text-sm font-semibold capitalize`}
                      >
                        {parking.status}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell>{parking.price}</StyledTableCell>
                    <StyledTableCell>
                      <div className='flex gap-4'>
                        <button className='text-blue-500 cursor-pointer' onClick={() => handleEditClick(parking.id)}>
                          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                            <g
                              fill='none'
                              stroke='currentColor'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                            >
                              <path d='M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                              <path d='M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z' />
                            </g>
                          </svg>
                        </button>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className='flex gap-4'>
                        <button
                          className='text-red-500 cursor-pointer'
                          onClick={() => {
                            handleDelete(parking.id)
                          }}
                        >
                          <svg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 0 48 48'>
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
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align='center'>
                    {t('no_parkings_found')}
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
        <DialogTitle sx={{ color: '#1976d3', fontWeight: 'bold', fontSize: '22px' }}>{t('edit')}</DialogTitle>
        <DialogContent sx={{ width: '350px' }}>
          <form className='rounded' noValidate onSubmit={onSubmit}>
            <div>
              <label className='block text-sm font-semibold'>
                {t('status')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <select
                {...register('status')}
                defaultValue={editingItem?.status}
                className='mt-1 w-full py-4 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              >
                <option value='true'>Active</option>
                <option value='false'>Inactive</option>
              </select>
            </div>
            <div className='mt-5'>
              <label className='block text-sm font-semibold'>
                {t('checking')}
                <span className='text-red-600 ml-1'>*</span>
              </label>
              <select
                {...register('checking')}
                defaultValue={editingItem?.checking}
                className='mt-1 w-full py-4 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              >
                <option value='true'>Check In</option>
                <option value='false'>Check Out</option>
              </select>
            </div>
            <div className='flex justify-end gap-4 mt-10'>
              <Button
                type='submit'
                variant='contained'
                style={{ color: 'white', background: '#2976ce', fontWeight: 'semi-bold' }}
              >
                {t('submit_save')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
