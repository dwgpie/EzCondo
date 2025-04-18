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
import { getAllElectric, addElectricityReading } from '~/apis/service.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { addElectricMeterSchema } from '~/utils/rules'
import { Button } from '@mui/material'
import SubjectIcon from '@mui/icons-material/Subject'
import { toast } from 'react-toastify'

interface UploadFormData {
  file: FileList
}

interface ElectricityMeter {
  electricReadingId?: string
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

export default function ElectricityReading() {
  const { register, handleSubmit, setValue, clearErrors, reset } = useForm<UploadFormData>({
    resolver: yupResolver(addElectricMeterSchema)
  })

  const [listElectric, setListElectric] = useState<ElectricityMeter[]>([])
  const [filteredElectrics, setFilteredElectrics] = useState<ElectricityMeter[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 4
  const totalPages = Math.ceil(filteredElectrics.length / pageSize)
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

  const getAllElectricityReadings = useMutation({
    mutationFn: async () => {
      const response = await getAllElectric()
      return response.data
    },
    onSuccess: (data) => {
      setListElectric(data)
      setFilteredElectrics(data)
    }
  })
  useEffect(() => {
    getAllElectricityReadings.mutate()
    console.log('list: ', listElectric)
  }, [])

  const handleCallAPI = async (formData: UploadFormData) => {
    try {
      await addElectricityReading(formData.file[0])
      getAllElectricityReadings.mutate()
      toast.success('Import successful')
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

  const paginatedElectricMeter = filteredElectrics.slice((page - 1) * pageSize, page * pageSize)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-green-200 text-green-800'
      case 'ipending':
        return 'bg-red-200 text-red-800'
      default:
        return ''
    }
  }

  const handleDetailClick = (id: string) => {
    window.location.href = `/manager/electricity-detail?electricReadingId=${id}`
  }

  return (
    <div className='pt-5 mx-5 z-13' style={{ height: 'calc(100vh - 80px)' }}>
      <div className='mb-6 p-6 bg-white drop-shadow-md rounded-xl'>
        <form onSubmit={onSubmit} className='mb-6'>
          <div className='w-full flex gap-4'>
            <div
              className='w-64 h-auto p-2 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-100'
              onClick={() => fileInputExcelRef.current?.click()}
              onDrop={handleExcelDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {excelFileName ? (
                <p className='text-green-700 font-medium text-sm text-center'>{excelFileName}</p>
              ) : (
                <>
                  <img src='/public/imgs/logo/excel.png' className='w-12 object-cover' />
                  <p className='text-gray-700 font-semibold mt-2 text-sm'>Upload Excel File</p>
                  <p className='text-gray-500 text-xs mt-1 text-center'>Drag and drop .xlsx or .xls files here</p>
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
            <div className='flex items-end justify-end gap-4 mt-3'>
              <Button
                type='submit'
                variant='contained'
                style={{ color: 'white', background: '#0f74e7', fontWeight: 'semi-bold' }}
              >
                Import
              </Button>
            </div>
          </div>
        </form>
        <Paper elevation={4}>
          <TableContainer>
            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell width='5%'>Id</StyledTableCell>
                  <StyledTableCell width='15%'>Name</StyledTableCell>
                  <StyledTableCell width='11%'>Apartment Number</StyledTableCell>
                  <StyledTableCell width='8%'>Phone Number</StyledTableCell>
                  <StyledTableCell width='10%'>Reading Date</StyledTableCell>
                  <StyledTableCell width='6%'>Consumption</StyledTableCell>
                  <StyledTableCell width='10%'>Status</StyledTableCell>
                  <StyledTableCell width='5%'>Detail</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedElectricMeter.length > 0 ? (
                  paginatedElectricMeter.map((electric, index) => (
                    <StyledTableRow key={`${electric.fullName}-${index}`}>
                      <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>
                        {(page - 1) * pageSize + index + 1}
                      </StyledTableCell>
                      <StyledTableCell>{electric.fullName}</StyledTableCell>
                      <StyledTableCell>{electric.apartmentNumber}</StyledTableCell>
                      <StyledTableCell>{electric.phoneNumber}</StyledTableCell>
                      <StyledTableCell>
                        {new Intl.DateTimeFormat('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }).format(new Date(electric.readingDate))}
                      </StyledTableCell>
                      <StyledTableCell>{electric.consumption}</StyledTableCell>
                      <StyledTableCell>
                        <span
                          className={`${getStatusColor(electric.status)} px-2 py-1 rounded-full text-sm font-semibold capitalize`}
                        >
                          {electric.status}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell>
                        <div className='flex gap-2 ml-2'>
                          <button
                            className='text-blue-500 cursor-pointer'
                            onClick={() => handleDetailClick(electric.electricReadingId || '')}
                          >
                            <SubjectIcon />
                          </button>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align='center'>
                      No electrics found
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
    </div>
  )
}
