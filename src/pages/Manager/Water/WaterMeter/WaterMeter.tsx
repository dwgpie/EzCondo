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
import { getAllWaterMeter, addWaterMeter, dowloadTemplateWaterMeter } from '~/apis/service.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { addWaterMeterSchema } from '~/utils/rules'
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

interface WaterMeter {
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

export default function WaterMeter() {
  const { register, handleSubmit, setValue, clearErrors, reset } = useForm<UploadFormData>({
    resolver: yupResolver(addWaterMeterSchema)
  })
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const [listWater, setListWater] = useState<WaterMeter[]>([])
  const [filteredWaters, setFilteredWaters] = useState<WaterMeter[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 5
  const totalPages = Math.ceil(filteredWaters.length / pageSize)
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
  const getAllWaterMeters = useMutation({
    mutationFn: async () => {
      setLoading(true)
      const response = await getAllWaterMeter()
      return response.data
    },
    onSuccess: (data) => {
      setListWater(data)
      setFilteredWaters(data)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  })
  useEffect(() => {
    getAllWaterMeters.mutate()
    console.log('list: ', listWater)
  }, [])

  const handleCallAPI = async (formData: UploadFormData) => {
    try {
      await addWaterMeter(formData.file[0])
      getAllWaterMeters.mutate()
      toast.success('Import successful', {
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
      // Show error message when validation fails
      if (errors.file) {
        toast.error(errors.file.message, {
          style: { width: 'fit-content' }
        })
      }
    }
  )

  const paginatedWaterMeter = filteredWaters.slice((page - 1) * pageSize, page * pageSize)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const handleDownload = async () => {
    try {
      const response = await dowloadTemplateWaterMeter()
      const blob = new Blob([response.data], { type: response.data.type })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'Template_Water_Meter.xlsx') // đặt tên file ở đây
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
          <h2 className='text-xl font-semibold text-gray-500'>{t('water_meter_management')}</h2>
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
                <StyledTableCell width='5%'>{t('id')}</StyledTableCell>
                <StyledTableCell width='13%'>{t('apartment_number')}</StyledTableCell>
                <StyledTableCell width='13%'>{t('meter_number')}</StyledTableCell>
                <StyledTableCell width='8%'>{t('installation_date')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedWaterMeter.length > 0 ? (
                paginatedWaterMeter.map((water, index) => (
                  <StyledTableRow key={water.id}>
                    <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>
                      {(page - 1) * pageSize + index + 1}
                    </StyledTableCell>
                    <StyledTableCell>{water.apartmentNumber}</StyledTableCell>
                    <StyledTableCell>{water.meterNumber}</StyledTableCell>
                    <StyledTableCell>
                      {new Intl.DateTimeFormat('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        timeZone: 'Asia/Ho_Chi_Minh'
                      }).format(new Date(water.installationDate + 'Z'))}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align='center'>
                    {t('no_waters_found')}
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
  )
}
