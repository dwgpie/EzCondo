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
import { getAllIncident } from '~/apis/incident.api'
import Pagination from '@mui/material/Pagination'
import { useTranslation } from 'react-i18next'

interface Incident {
  id: string
  userId: string
  fullName: string
  apartmentNumber: string
  type: string
  title: string
  description: string
  reportedAt: string
  status: string
  priority: number
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

export default function ListIncident() {
  const { t } = useTranslation('incidentManager')
  const [listIncident, setListIncident] = useState<Incident[]>([])

  const [page, setPage] = useState(1)
  const pageSize = 6
  const totalPages = Math.ceil(listIncident.length / pageSize)

  const getAllIncidentMutation = useMutation({
    mutationFn: async () => {
      const response = await getAllIncident()
      return response.data
    },
    onSuccess: (data) => {
      setListIncident(data)
    },
    onError: (error) => {
      console.error('Lỗi khi hiển thị danh sách incident:', error)
    }
  })
  useEffect(() => {
    getAllIncidentMutation.mutate()
    console.log('list: ', listIncident)
  }, [])

  const handleDetailButton = (id: string) => {
    window.location.href = `/manager/update-incident?id=${id}`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-red-500 text-white'
      case 'underway':
        return 'bg-orange-500 text-white'
      case 'resolved':
        return 'bg-green-500 text-white'
      default:
        return ''
    }
  }

  // Hàm lấy user theo trang hiện tại
  const paginatedIncidents = listIncident.slice((page - 1) * pageSize, page * pageSize)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      <div className='mb-[20px]'>
        <h2 className='text-2xl font-semibold text-gray-500 ml-1'>{t('incident_list')}</h2>
      </div>
      <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='5%'>{t('id')}</StyledTableCell>
                <StyledTableCell width='15%'>{t('full_name')}</StyledTableCell>
                <StyledTableCell width='12%'>{t('apartment')}</StyledTableCell>
                <StyledTableCell width='10%'>{t('type')}</StyledTableCell>
                <StyledTableCell width='15%'>{t('title')}</StyledTableCell>
                <StyledTableCell width='15%'>{t('date_of_report')}</StyledTableCell>
                <StyledTableCell width='13%'>{t('status')}</StyledTableCell>
                <StyledTableCell width='8%'>{t('detail')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedIncidents.length > 0 ? (
                paginatedIncidents.map((incident, index) => (
                  <StyledTableRow key={incident.id}>
                    <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>
                      {(page - 1) * pageSize + index + 1}
                    </StyledTableCell>
                    <StyledTableCell>{incident.fullName}</StyledTableCell>
                    <StyledTableCell>{incident.apartmentNumber}</StyledTableCell>
                    <StyledTableCell>{incident.type}</StyledTableCell>
                    <StyledTableCell>{incident.title}</StyledTableCell>
                    <StyledTableCell>
                      {new Intl.DateTimeFormat('vi-VN').format(new Date(incident.reportedAt))}
                    </StyledTableCell>
                    <StyledTableCell>
                      <span
                        className={`${getStatusColor(incident.status)} capitalize px-2 py-1 rounded-full text-sm font-semibold`}
                      >
                        {incident.status}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell colSpan={1}>
                      <div className='ml-2'>
                        <button
                          className='text-blue-500 cursor-pointer'
                          onClick={() => {
                            handleDetailButton(incident.id)
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
                    {t('no_incidents_found')}
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
