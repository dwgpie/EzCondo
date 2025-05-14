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
import { getAllParkingLot, acceptParking } from '~/apis/service.api'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'

interface Parking {
  parkingId: string
  name: string
  apartment: string
  numberOfMotorbike: number
  numberOfCar: number
  accept: boolean
  total: number
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

export default function RequestParking() {
  const { t } = useTranslation('parkingManager')
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const [listParking, setListParking] = useState<Parking[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 6

  const getAllParkingMutation = useMutation({
    mutationFn: async () => {
      setLoading(true)
      const response = await getAllParkingLot()
      return response.data
    },
    onSuccess: (data) => {
      setListParking(data)

      // Delay để progress có thời gian hiển thị
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    },
    onError: (error) => {
      console.error(error)
    }
  })

  useEffect(() => {
    getAllParkingMutation.mutate()
  }, [])

  const handleAcceptParking = async (parkingId: string) => {
    Swal.fire({
      title: 'Are you sure you want to Accept this parking request?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Accept',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await acceptParking({ parkingLotId: parkingId, accept: true })
          Swal.fire('Accepted!', 'The parking request has been accepted.', 'success')
          getAllParkingMutation.mutate()
        } catch (error) {
          Swal.fire('Error!', 'Unable to accept the parking request!', 'error')
          console.error('Error accepting parking:', error)
        }
      }
    })
  }

  const handleRejectParking = async (parkingId: string) => {
    Swal.fire({
      title: 'Are you sure you want to Reject this parking request?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await acceptParking({ parkingLotId: parkingId, accept: false })
          Swal.fire('Rejected!', 'The parking request has been rejected.', 'success')
          getAllParkingMutation.mutate()
        } catch (error) {
          Swal.fire('Error!', 'Unable to reject the parking request!', 'error')
          console.error('Error rejecting parking:', error)
        }
      }
    })
  }

  const filteredParking = listParking.filter((parking) => parking.accept === false)
  const totalPages = Math.ceil(filteredParking.length / pageSize)
  const paginatedUsers = filteredParking.slice((page - 1) * pageSize, page * pageSize)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && (
        <div className='w-full px-6 fixed top-2 left-0 z-50'>
          <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
        </div>
      )}
      <div className='flex gap-4 mb-6 justify-between font-bold '>
        <h2 className='text-2xl font-semibold text-gray-500'>{t('parking_request_list')}</h2>
      </div>
      <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='5%'>{t('id')}</StyledTableCell>
                <StyledTableCell width='24%'>{t('full_name')}</StyledTableCell>
                <StyledTableCell width='10%'>{t('apartment')}</StyledTableCell>
                <StyledTableCell width='17%'>{t('number_of_motorbike')}</StyledTableCell>
                <StyledTableCell width='15%'>{t('number_of_car')}</StyledTableCell>
                <StyledTableCell width='9%'>{t('total')}</StyledTableCell>
                <StyledTableCell width='10%'>{t('accept')}</StyledTableCell>
                <StyledTableCell width='8%'>{t('reject')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((parking, index) => (
                  <StyledTableRow key={parking.parkingId}>
                    <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>
                      {(page - 1) * pageSize + index + 1}
                    </StyledTableCell>
                    <StyledTableCell>{parking.name}</StyledTableCell>
                    <StyledTableCell>{parking.apartment}</StyledTableCell>
                    <StyledTableCell>{parking.numberOfMotorbike}</StyledTableCell>
                    <StyledTableCell>{parking.numberOfCar}</StyledTableCell>
                    <StyledTableCell>{parking.total}</StyledTableCell>
                    <StyledTableCell>
                      <div className='flex ml-3'>
                        <button
                          className='text-green-500 cursor-pointer'
                          onClick={() => {
                            handleAcceptParking(parking.parkingId)
                          }}
                        >
                          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                            <path
                              fill='currentColor'
                              d='m23 12l-2.44-2.78l.34-3.68l-3.61-.82l-1.89-3.18L12 3L8.6 1.54L6.71 4.72l-3.61.81l.34 3.68L1 12l2.44 2.78l-.34 3.69l3.61.82l1.89 3.18L12 21l3.4 1.46l1.89-3.18l3.61-.82l-.34-3.68zm-13 5l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9z'
                            />
                          </svg>
                        </button>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className='flex ml-3'>
                        <button
                          className='text-red-500 cursor-pointer'
                          onClick={() => {
                            handleRejectParking(parking.parkingId)
                          }}
                        >
                          <svg xmlns='http://www.w3.org/2000/svg' width='27' height='27' viewBox='0 0 48 48'>
                            <defs>
                              <mask id='ipTDeleteFive0'>
                                <g fill='none' stroke='#fff' strokeLinejoin='round' strokeWidth='4'>
                                  <path strokeLinecap='round' d='M8 11h32M18 5h12' />
                                  <path fill='#555555' d='M12 17h24v23a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3z' />
                                  <path strokeLinecap='round' d='m20 25l8 8m0-8l-8 8' />
                                </g>
                              </mask>
                            </defs>
                            <path fill='currentColor' d='M0 0h48v48H0z' mask='url(#ipTDeleteFive0)' />
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
    </div>
  )
}
