import { useEffect, useRef, useState } from 'react'
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
import { useForm } from 'react-hook-form'
import { getAllWater, addWaterReading, dowloadTemplateWaterReading } from '~/apis/service.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { addWaterMeterSchema } from '~/utils/rules'
import { Button } from '@mui/material'
import SubjectIcon from '@mui/icons-material/Subject'
import { toast } from 'react-toastify'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

interface UploadFormData {
  file: FileList
}

interface WaterMeter {
  waterReadingId?: string
  fullName: string
  apartmentNumber: string
  phoneNumber: string
  readingDate: string
  consumption: string
  status: string
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f4f4f5',
    color: theme.palette.common.black,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    padding: '10px 12px'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontFamily: 'Roboto',
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

export default function WaterReading() {
  const { register, handleSubmit, setValue, clearErrors, reset } = useForm<UploadFormData>({
    resolver: yupResolver(addWaterMeterSchema)
  })

  const [listWater, setListWater] = useState<WaterMeter[]>([])
  const [filteredWaters, setFilteredWaters] = useState<WaterMeter[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 5
  const totalPages = Math.ceil(filteredWaters.length / pageSize)
  const [excelFileName, setExcelFileName] = useState<string | null>(null)
  const fileInputExcelRef = useRef<HTMLInputElement | null>(null)

  const handleExcelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      setValue('file', dataTransfer.files)
      setExcelFileName(file.name)
      clearErrors('file')
    }
  }

  const handleExcelDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      setValue('file', dataTransfer.files)
      setExcelFileName(file.name)
      clearErrors('file')
    }
  }

  const getAllWaterReadings = useMutation({
    mutationFn: async () => {
      const response = await getAllWater()
      return response.data
    },
    onSuccess: (data) => {
      setListWater(data)
      setFilteredWaters(data)
    }
  })
  useEffect(() => {
    getAllWaterReadings.mutate()
    console.log('list: ', listWater)
  }, [])

  const handleCallAPI = async (formData: UploadFormData) => {
    try {
      await addWaterReading(formData.file[0])
      getAllWaterReadings.mutate()
      toast.success('Import successful', {
        style: { width: 'fit-content' }
      })
    } catch (error) {
      console.error('API call failed:', error)
    }
  }

  const onSubmit = handleSubmit((formData) => {
    handleCallAPI(formData)
    reset()
    // Reset thêm DOM file input
    if (fileInputExcelRef.current) {
      fileInputExcelRef.current.value = ''
    }
    // Reset tên file hiển thị
    setExcelFileName(null)
  })

  const paginatedWaterMeter = filteredWaters.slice((page - 1) * pageSize, page * pageSize)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-300 text-green-900 hover:bg-green-400 hover:text-white'
      case 'pending':
        return 'bg-orange-300 text-orange-900 hover:bg-orange-400 hover:text-white'
      case 'overdue':
        return 'bg-red-400 text-red-900 hover:bg-red-500 hover:text-white'
      default:
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }
  }

  const handleDetailClick = (id: string) => {
    window.location.href = `/manager/water-detail?waterReadingId=${id}`
  }

  const handleDownload = async () => {
    try {
      const response = await dowloadTemplateWaterReading()
      const blob = new Blob([response.data], { type: response.data.type })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'Template_Water_Reading.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Lỗi khi tải file:', error)
    }
  }

  return (
    <div className='pt-5 mx-5 z-13' style={{ height: 'calc(100vh - 80px)' }}>
      <div className='px-8 py-4 bg-gradient-to-br from-white via-white to-blue-100 shadow-xl rounded-2xl space-y-6'>
        <form onSubmit={onSubmit}>
          <div className='flex justify-between items-center'>
            <h2 className='text-xl font-semibold text-gray-700'>Water Reading Management</h2>
            <div className='flex gap-3 mb-3'>
              <Button
                onClick={handleDownload}
                variant='contained'
                startIcon={<FileDownloadIcon />}
                sx={{
                  backgroundColor: '#f97316',
                  '&:hover': {
                    backgroundColor: '#ea580c'
                  },
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2
                }}
              >
                Export Template
              </Button>

              <Button
                type='submit'
                variant='contained'
                startIcon={<CloudUploadIcon />}
                sx={{
                  backgroundColor: '#0ea5e9',
                  '&:hover': {
                    backgroundColor: '#0284c7'
                  },
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2
                }}
              >
                Import
              </Button>
            </div>
          </div>
          <div
            className='border-2 border-dashed border-blue-400 rounded-xl flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 pt-3 pb-2 cursor-pointer transition space-y-1'
            onClick={() => fileInputExcelRef.current?.click()}
            onDrop={handleExcelDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {excelFileName ? (
              <p className='text-green-700 font-medium text-center text-xs'>{excelFileName}</p>
            ) : (
              <>
                <img src='/public/imgs/logo/excel.png' alt='excel' className='w-11' />
                <p className='text-blue-800 font-semibold text-[13px] mt-1'>Upload Excel File</p>
                <p className='text-gray-500 text-[12px] text-center'>Drag & drop .xlsx or .xls files</p>
              </>
            )}
            <input
              type='file'
              accept='.xlsx, .xls'
              {...register('file')}
              ref={fileInputExcelRef}
              className='hidden'
              onChange={handleExcelChange}
            />
          </div>
        </form>

        <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell width='2%'>ID</StyledTableCell>
                  <StyledTableCell width='15%'>Name</StyledTableCell>
                  <StyledTableCell width='12%'>Apartment Number</StyledTableCell>
                  <StyledTableCell width='10%'>Phone</StyledTableCell>
                  <StyledTableCell width='12%'>Reading Date</StyledTableCell>
                  <StyledTableCell width='8%'>Consumption</StyledTableCell>
                  <StyledTableCell width='10%'>Status</StyledTableCell>
                  <StyledTableCell width='6%'>Detail</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedWaterMeter.length > 0 ? (
                  paginatedWaterMeter.map((water, index) => (
                    <StyledTableRow key={`${water.fullName}-${index}`}>
                      <StyledTableCell sx={{ fontWeight: 600 }}>{(page - 1) * pageSize + index + 1}</StyledTableCell>
                      <StyledTableCell>{water.fullName}</StyledTableCell>
                      <StyledTableCell>{water.apartmentNumber}</StyledTableCell>
                      <StyledTableCell>{water.phoneNumber}</StyledTableCell>
                      <StyledTableCell>
                        {new Intl.DateTimeFormat('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }).format(new Date(water.readingDate))}
                      </StyledTableCell>
                      <StyledTableCell>{water.consumption}</StyledTableCell>
                      <StyledTableCell>
                        <span
                          className={`${getStatusColor(
                            water.status
                          )} px-3 py-1.5 rounded-full text-sm font-semibold capitalize`}
                        >
                          {water.status}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell>
                        <div className='flex p-2'>
                          <button
                            className='text-blue-600 hover:text-blue-800 transition-colors cursor-pointer'
                            onClick={() => handleDetailClick(water.waterReadingId || '')}
                          >
                            <SubjectIcon />
                          </button>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align='center'>
                      No waters found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <div className='flex justify-center mt-6'>
          <Pagination count={totalPages} page={page} onChange={handlePageChange} />
        </div>
      </div>
    </div>
  )
}
