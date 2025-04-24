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
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { getAllIncident } from '~/apis/incident.api'
// import { SearchContext } from '~/components/Search/SearchContext'
import Pagination from '@mui/material/Pagination'

export default function UpdateIncident() {
  // const { searchQuery } = useContext(SearchContext)!
  const [listIncident, setListIncident] = useState<[]>([])

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

  return (
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      UpdateIncident
    </div>
  )
}
