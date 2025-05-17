import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { getAllOtherService, updateOtherService, deleteOtherService } from '~/apis/service.api'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Pagination, TextField, Button } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import Swal from 'sweetalert2'

interface FormData {
  id?: string
  name: string
  price: number
  description: string
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

export default function ListGeneralService() {
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const [listService, setListService] = useState<FormData[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 6
  const totalPages = Math.ceil(listService.length / pageSize)
  const { t } = useTranslation('service')

  const getAllServiceMutation = useMutation({
    mutationFn: async () => {
      setLoading(true)
      const response = await getAllOtherService()
      return response.data
    },
    onSuccess: (data) => {
      setListService(data)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    },
    onError: (error) => {
      console.error('Error:', error)
    }
  })

  // Lưu mutate vào useRef
  const mutateRef = useRef(getAllServiceMutation.mutate)

  useEffect(() => {
    mutateRef.current() // Gọi mutate từ ref để tránh dependency issue
  }, [])

  // Hàm lấy service theo trang hiện tại
  const paginatedServices = listService.slice((page - 1) * pageSize, page * pageSize)
  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const [editingItem, setEditingItem] = useState<FormData | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)

  const handleEditClick = (item: FormData) => {
    setEditingItem(item)
    setOpenEditDialog(true)
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
    setEditingItem(null)
  }

  const handleEditSubmit = async () => {
    if (editingItem && editingItem.id) {
      try {
        await updateOtherService({
          id: editingItem.id,
          name: editingItem.name,
          price: editingItem.price,
          description: editingItem.description
        })
        toast.success(t('service_update_success'), {
          style: { width: 'fit-content' }
        })
        handleCloseEditDialog()
        getAllServiceMutation.mutate()
      } catch (error) {
        console.error('Update failed:', error)
      }
    }
  }

  const handleDelete = (id?: string) => {
    if (!id) {
      toast.error(t('invalid_id'))
      return
    }

    Swal.fire({
      title: t('delete_confirm_title'),
      text: t('delete_confirm_text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('delete'),
      cancelButtonText: t('cancel'),
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOtherService(id)
          Swal.fire(t('deleted'), t('service_deleted_success'), 'success')
          getAllServiceMutation.mutate()
        } catch (error) {
          Swal.fire('Error!', t('service_delete_fail'), 'error')
          console.error('Error deleting electricity:', error)
        }
      }
    })
  }

  return (
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && (
        <div className='w-full px-6 fixed top-2 left-0 z-50'>
          <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
        </div>
      )}
      <div className='mb-[20px]'>
        <h2 className='text-2xl font-semibold text-gray-500'>{t('general_service_list')}</h2>
      </div>
      <Paper elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell width='5%'>{t('id')}</StyledTableCell>
                <StyledTableCell width='18%'>{t('name')}</StyledTableCell>
                <StyledTableCell width='40%'>{t('description')}</StyledTableCell>
                <StyledTableCell width='13%'>{t('price')}</StyledTableCell>
                <StyledTableCell width='10%'>{t('edit')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedServices.length > 0 ? (
                paginatedServices.map((service, index) => (
                  <StyledTableRow key={service.id}>
                    <StyledTableCell sx={{ color: 'black', fontWeight: '600' }}>{index + 1}</StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color: 'black',
                        fontWeight: '600',
                        textAlign: 'justify',
                        maxWidth: 50,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {service.name}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        textAlign: 'justify',
                        maxWidth: 50,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {service.description}
                    </StyledTableCell>
                    <StyledTableCell>{service.price?.toLocaleString('en-US')}</StyledTableCell>
                    <StyledTableCell>
                      <div className='flex gap-1'>
                        <button
                          type='button'
                          className='text-blue-500 cursor-pointer bg-blue-100 p-1.5 rounded-full'
                          onClick={() => handleEditClick(service)}
                        >
                          <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24'>
                            <g
                              fill='none'
                              stroke='currentColor'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                            >
                              <path d='M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                              <path d='M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z' />
                            </g>
                          </svg>
                        </button>
                        <button
                          type='button'
                          className='text-red-500 cursor-pointer bg-red-100 p-1.5 rounded-full ml-2'
                          onClick={() => {
                            handleDelete(service.id)
                          }}
                        >
                          <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 48 48'>
                            <defs>
                              <mask id='ipTDelete0'>
                                <g fill='none' stroke='#fff' strokeLinejoin='round' strokeWidth='4'>
                                  <path fill='#555555' d='M9 10v34h30V10z' />
                                  <path strokeLinecap='round' d='M20 20v13m8-13v13M4 10h40' />
                                  <path fill='#555555' d='m16 10l3.289-6h9.488L32 10z' />
                                </g>
                              </mask>
                            </defs>
                            <path fill='currentColor' d='M0 0h48v48H0z' mask='url(#ipTDelete0)' />
                          </svg>
                        </button>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align='center'>
                    {t('no_services_found')}
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
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        disableEnforceFocus
        disableRestoreFocus
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle sx={{ color: '#1976d3', fontWeight: 'bold', fontSize: '22px' }}>{t('edit_service')}</DialogTitle>
        <DialogContent>
          <div className='flex flex-col gap-4 mt-4'>
            <TextField
              label={t('name')}
              type='text'
              value={editingItem?.name}
              onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, name: String(e.target.value) } : null))}
              fullWidth
              sx={{ backgroundColor: 'white' }}
            />
            <TextField
              label={t('description')}
              type='text'
              value={editingItem?.description}
              onChange={(e) =>
                setEditingItem((prev) => (prev ? { ...prev, description: String(e.target.value) } : null))
              }
              fullWidth
              multiline
              rows={8}
              sx={{ backgroundColor: 'white' }}
            />
            <TextField
              label={t('price')}
              type='number'
              value={editingItem?.price}
              onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, price: Number(e.target.value) } : null))}
              fullWidth
              sx={{ backgroundColor: 'white' }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>{t('cancel')}</Button>
          <Button onClick={handleEditSubmit} variant='contained' color='primary'>
            {t('save_changes')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
