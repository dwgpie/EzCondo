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
import { getAllParkingLot } from '~/apis/service.api'
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

export default function ListParking() {
  const { t } = useTranslation('parkingManager')
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const [listParking, setListParking] = useState<Parking[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 5

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

  const handleGetParking = (parkingId: string) => {
    window.location.href = `/manager/detail-parking?parkingLotId=${parkingId}`
  }

  // Hàm lấy user theo trang hiện tại
  const totalPages = Math.ceil(listParking.length / pageSize)
  const paginatedUsers = listParking.slice((page - 1) * pageSize, page * pageSize)

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
        <h2 className='text-2xl font-semibold text-gray-500'>{t('parking_list')}</h2>
      </div>
      <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='5%'>{t('id')}</StyledTableCell>
                <StyledTableCell width='24%'>{t('full_name')}</StyledTableCell>
                <StyledTableCell width='10%'>{t('apartment')}</StyledTableCell>
                <StyledTableCell width='15%'>{t('number_of_motorbike')}</StyledTableCell>
                <StyledTableCell width='15%'>{t('number_of_car')}</StyledTableCell>
                <StyledTableCell width='10%'>{t('total')}</StyledTableCell>
                <StyledTableCell width='8%'>{t('detail')}</StyledTableCell>
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
                    <StyledTableCell colSpan={1}>
                      <div className=''>
                        <button
                          className='text-blue-500 cursor-pointer bg-blue-100 p-1.5 rounded-full'
                          onClick={() => {
                            handleGetParking(parking.parkingId)
                          }}
                        >
                          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 48 48'>
                            <g fill='none' stroke='currentColor' strokeLinejoin='round' strokeWidth='4'>
                              <rect width='36' height='36' x='6' y='6' rx='3' />
                              <path d='M13 13h8v8h-8z' />
                              <path strokeLinecap='round' d='M27 13h8m-8 7h8m-22 8h22m-22 7h22' />
                            </g>
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
