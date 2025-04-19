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
import { getAllElectricityMeter, addElectricityMeter } from '~/apis/service.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { addElectricMeterSchema } from '~/utils/rules'
import { Button } from '@mui/material'
import { toast } from 'react-toastify'

interface UploadFormData {
  file: FileList
}

interface ElectricityMeter {
  id: string
  meterNumber: string
  installationDate: string
  apartmentId: string
  apartmentNumber: string
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

export default function ElectricityMeter() {
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
  const getAllElectricityMeters = useMutation({
    mutationFn: async () => {
      const response = await getAllElectricityMeter()
      return response.data
    },
    onSuccess: (data) => {
      setListElectric(data)
      setFilteredElectrics(data)
    }
  })
  useEffect(() => {
    getAllElectricityMeters.mutate()
    console.log('list: ', listElectric)
  }, [])

  const handleCallAPI = async (formData: UploadFormData) => {
    try {
      await addElectricityMeter(formData.file[0])
      getAllElectricityMeters.mutate()
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

  return (
    <div className='pt-5 mx-5 z-13' style={{ height: 'calc(100vh - 80px)' }}>
      <div className='mb-6 p-6 bg-white drop-shadow-md rounded-xl'>
        <form onSubmit={onSubmit} className='mb-6'>
          <div className='w-full'>
            <div
              className='w-full h-auto p-2 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-100'
              onClick={() => fileInputExcelRef.current?.click()}
              onDrop={handleExcelDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {excelFileName ? (
                <p className='text-green-700 font-medium'>{excelFileName}</p>
              ) : (
                <>
                  <img src='/public/imgs/logo/excel.png' className='w-20 object-cover' />
                  <p className='text-gray-700 font-semibold mt-2'>Upload Excel File</p>
                  <p className='text-gray-500 text-sm mt-2'>Drag and drop .xlsx or .xls files here</p>
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
          </div>
          <div className='flex justify-end gap-4 mt-3'>
            <Button
              type='submit'
              variant='contained'
              style={{ color: 'white', background: '#2976ce', fontWeight: 'semi-bold' }}
            >
              Import
            </Button>
          </div>
        </form>
        <Paper elevation={4}>
          <TableContainer>
            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell width='10%'>Id</StyledTableCell>
                  <StyledTableCell width='15%'>Aparment Number</StyledTableCell>
                  <StyledTableCell width='15%'>Metter Number</StyledTableCell>
                  <StyledTableCell width='10%'>Installation Date</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedElectricMeter.length > 0 ? (
                  paginatedElectricMeter.map((electric, index) => (
                    <StyledTableRow key={electric.id}>
                      <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>
                        {(page - 1) * pageSize + index + 1}
                      </StyledTableCell>
                      <StyledTableCell>{electric.apartmentNumber}</StyledTableCell>
                      <StyledTableCell>{electric.meterNumber}</StyledTableCell>
                      <StyledTableCell>{electric.installationDate}</StyledTableCell>
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
