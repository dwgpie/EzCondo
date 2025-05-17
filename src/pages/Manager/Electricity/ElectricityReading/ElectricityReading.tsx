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
import { getAllElectric, addElectricityReading, dowloadTemplateElectricReading } from '~/apis/service.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { addElectricMeterSchema } from '~/utils/rules'
import { Button } from '@mui/material'
import { toast } from 'react-toastify'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
import { useTranslation } from 'react-i18next'

interface UploadFormData {
  file: FileList
}

interface ElectricityReading {
  electricReadingId?: string
  fullName: string
  apartmentNumber: string
  phoneNumber: string
  readingPreDate: string
  readingCurrentDate: string
  consumption: string
  status: string
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

export default function ElectricityReading() {
  const { register, handleSubmit, setValue, clearErrors, reset } = useForm<UploadFormData>({
    resolver: yupResolver(addElectricMeterSchema)
  })
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const [filteredElectrics, setFilteredElectrics] = useState<ElectricityReading[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 5
  const totalPages = Math.ceil(filteredElectrics.length / pageSize)
  const [excelFileName, setExcelFileName] = useState<string | null>(null)
  const fileInputExcelRef = useRef<HTMLInputElement | null>(null)
  const { t } = useTranslation('electricManager')

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
      setLoading(true)
      const response = await getAllElectric()
      return response.data
    },
    onSuccess: (data) => {
      // Sort data by readingCurrentDate in descending order
      const sortedData = [...data].sort(
        (a, b) => new Date(b.readingCurrentDate).getTime() - new Date(a.readingCurrentDate).getTime()
      )
      setFilteredElectrics(sortedData)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  })
  useEffect(() => {
    getAllElectricityReadings.mutate()
  }, [])

  const handleCallAPI = async (formData: UploadFormData) => {
    try {
      await addElectricityReading(formData.file[0])
      getAllElectricityReadings.mutate()
      toast.success(t('import_success'), {
        style: { width: 'fit-content' }
      })
    } catch (error) {
      const err = error as Error
      toast.error(t(err.message), {
        style: { width: 'fit-content' }
      })
    }
  }

  const onSubmit = handleSubmit(
    (formData) => {
      handleCallAPI(formData)
      reset()
      // Reset thêm DOM file input
      if (fileInputExcelRef.current) {
        fileInputExcelRef.current.value = ''
      }
      // Reset tên file hiển thị
      setExcelFileName(null)
    },
    (errors) => {
      if (errors.file) {
        toast.error(errors.file.message, {
          style: { width: 'fit-content' }
        })
      }
    }
  )

  const paginatedElectricMeter = filteredElectrics.slice((page - 1) * pageSize, page * pageSize)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-gradient-to-r from-green-200 to-green-300 text-green-700 font-semibold rounded-lg shadow-sm'
      case 'pending':
        return 'bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-700 font-semibold rounded-lg shadow-sm'
      case 'overdue':
        return 'bg-gradient-to-r from-red-200 to-red-300 text-red-700 font-semibold rounded-lg shadow-sm'
    }
  }

  const handleDetailClick = (id: string) => {
    window.location.href = `/manager/electricity-detail?electricReadingId=${id}`
  }

  const handleDownload = async () => {
    try {
      const response = await dowloadTemplateElectricReading()
      const blob = new Blob([response.data], { type: response.data.type })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'Template_Electric_Reading.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Lỗi khi tải file:', error)
    }
  }

  return (
    <div className='mx-5 mt-5 mb-5 px-6 pb-3 pt-3 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && (
        <div className='w-full px-6 fixed top-2 left-0 z-50'>
          <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
        </div>
      )}
      <form onSubmit={onSubmit} className='mt-2'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold text-gray-500'>{t('electricity_reading_management')}</h2>
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
              {t('export_template')}
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
              {t('import')}
            </Button>
          </div>
        </div>
        <div
          className='border-2 border-dashed border-blue-400 mb-4 rounded-xl flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 pt-3 pb-2 cursor-pointer transition space-y-1'
          onClick={() => fileInputExcelRef.current?.click()}
          onDrop={handleExcelDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {excelFileName ? (
            <p className='text-green-700 font-medium text-center text-xs'>{excelFileName}</p>
          ) : (
            <>
              <img src='/imgs/logo/excel.png' alt='excel' className='w-11' />
              <p className='text-blue-800 font-semibold text-[13px] mt-1'>{t('upload_excel_file')}</p>
              <p className='text-gray-500 text-[12px] text-center'>{t('drag_drop_excel')}</p>
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
                <StyledTableCell width='2%'>{t('id')}</StyledTableCell>
                <StyledTableCell width='16%'>{t('name')}</StyledTableCell>
                <StyledTableCell width='9%'>{t('APT_number')}</StyledTableCell>
                <StyledTableCell width='12%'>{t('phone')}</StyledTableCell>
                <StyledTableCell width='19%'>{t('reading_pre_date')}</StyledTableCell>
                <StyledTableCell width='19%'>{t('reading_current_date')}</StyledTableCell>
                <StyledTableCell width='8%'>{t('consumption')}</StyledTableCell>
                <StyledTableCell width='0%'>{t('status')}</StyledTableCell>
                <StyledTableCell width='7%'>{t('detail')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedElectricMeter.length > 0 ? (
                paginatedElectricMeter.map((electric, index) => (
                  <StyledTableRow key={`${electric.fullName}-${index}`}>
                    <StyledTableCell sx={{ fontWeight: 600 }}>{(page - 1) * pageSize + index + 1}</StyledTableCell>
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
                        day: '2-digit',
                        timeZone: 'Asia/Ho_Chi_Minh'
                      }).format(new Date(electric.readingPreDate + 'Z'))}
                    </StyledTableCell>
                    <StyledTableCell>
                      {new Intl.DateTimeFormat('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        timeZone: 'Asia/Ho_Chi_Minh'
                      }).format(new Date(electric.readingCurrentDate + 'Z'))}
                    </StyledTableCell>
                    <StyledTableCell>{electric.consumption}</StyledTableCell>
                    <StyledTableCell>
                      <span
                        className={`${getStatusColor(
                          electric.status
                        )} px-3 py-1.5 rounded-full text-sm font-semibold capitalize`}
                      >
                        {electric.status}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className=''>
                        <button
                          type='button'
                          className='text-blue-500 cursor-pointer bg-blue-100 p-1.5 rounded-full ml-2'
                          onClick={() => handleDetailClick(electric.electricReadingId || '')}
                        >
                          <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 48 48'>
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
                    {t('no_electrics_found')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <div className='flex justify-center mt-5'>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} />
      </div>
    </div>
  )
}
