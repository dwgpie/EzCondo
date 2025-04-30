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
import DeleteIcon from '@mui/icons-material/Delete'
import { getAllIncident } from '~/apis/incident.api'
import SubjectIcon from '@mui/icons-material/Subject'
import Pagination from '@mui/material/Pagination'

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
  // const { searchQuery } = useContext(SearchContext)!
  const [listIncident, setListIncident] = useState<Incident[]>([])
  // const [filteredIncident, setFilteredIncident] = useState<User[]>([])

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
        return 'bg-red-200 text-red-800'
      case 'underway':
        return 'bg-orange-200 text-orange-800'
      case 'resolved':
        return 'bg-green-200 text-green-800'
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
        <h2 className='text-2xl font-semibold text-gray-500 ml-1'>List Incident</h2>
      </div>
      <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='5%'>ID</StyledTableCell>
                <StyledTableCell width='15%'>Full Name</StyledTableCell>
                <StyledTableCell width='12%'>Apartment</StyledTableCell>
                <StyledTableCell width='10%'>Type</StyledTableCell>
                <StyledTableCell width='15%'>Title</StyledTableCell>
                <StyledTableCell width='15%'>Date of report</StyledTableCell>
                <StyledTableCell width='13%'>Status</StyledTableCell>
                <StyledTableCell width='8%'>Detail</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedIncidents.length > 0 ? (
                paginatedIncidents.map((incident, index) => (
                  <StyledTableRow key={incident.id}>
                    <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>
                      {' '}
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
                        className={`${getStatusColor(incident.status)} px-2 py-1 rounded-full text-sm font-semibold`}
                      >
                        {incident.status}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className='flex gap-4'>
                        <button
                          className='text-blue-500 cursor-pointer'
                          onClick={() => {
                            handleDetailButton(incident.id)
                          }}
                        >
                          <SubjectIcon />
                        </button>
                        <button
                          className='text-red-500 cursor-pointer'
                          // onClick={() => {
                          //   handleDelete(incident.id)
                          // }}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align='center'>
                    No incidents found
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
