import { useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import SideBarAdmin from '~/components/SideBar/SideBarAdmin'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Calculate } from '@mui/icons-material'
import Button from '@mui/material/Button'

export default function CreateNotification() {
  const [checkedManager, setCheckedManager] = useState(true)
  const [checkedSupportTeam, setCheckedSupportTeam] = useState(true)
  const [checkedAll, setCheckedAll] = useState(true)
  const [receiver, setReceiver] = useState<string[]>([])
  const [typeOfNotification, setTypeOfNotification] = useState('')

  const handleChangeManager = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setCheckedManager(event.target.checked)
    setReceiver((prev) => (event.target.checked ? [...prev, value] : prev.filter((item) => item !== value)))
    console.log(receiver)
  }
  const handleChangeSupportTeam = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setCheckedSupportTeam(event.target.checked)
    setReceiver((prev) => (event.target.checked ? [...prev, value] : prev.filter((item) => item !== value)))
    console.log(receiver)
  }
  const handleChangeAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setCheckedAll(event.target.checked)
    setReceiver((prev) => (event.target.checked ? [...prev, value] : prev.filter((item) => item !== value)))
    console.log(receiver)
  }

  const handleFilterTypeOfNotification = (event: SelectChangeEvent) => {
    setTypeOfNotification(event.target.value)
  }

  const handleCreate = () => {}
  const handleCancel = () => {}
  return (
    <div className='bg-[#EDF2F9] pt-25 z-13'>
      <div className='grid grid-cols-12 gap-15 items-start'>
        <div className='col-span-1'></div>

        <div className='col-span-2 sticky top-25'>
          <SideBarAdmin />
        </div>
        <div className='col-span-8'>
          <div className='flex justify-between   text-2xl font-semibold mb-[20px] px-6 drop-shadow-md rounded-xl z-10'>
            <h1 className='text-2xl font-semibold'>Notification</h1>
          </div>

          <div className='bg-[#fff] mb-[20px] shadow-md pb-[20px]'>
            {/* Receiver and Type of Notification */}
            <div className='flex w-full h-[60px] bg-[#F9FAFD] items-center'>
              <h2 className='text-[20px] text-[#344050] font-semibold ml-[24px]'>Create notification</h2>
            </div>
            <div>
              <div className='flex  gap-[50px] mt-[30px] ml-[50px]'>
                <p className='text-[16px] font-semibold ml-[30px]'>Receiver</p>
                <div>
                  <div className='flex items-center gap-[10px]'>
                    <Checkbox checked={checkedManager} value={'manager'} onChange={handleChangeManager} />
                    <p className='text-[16px] font-semibold'>Manager</p>
                  </div>

                  <div className='flex items-center gap-[10px]'>
                    <Checkbox checked={checkedSupportTeam} onChange={handleChangeSupportTeam} value={'support team'} />
                    <p className='text-[16px] font-semibold'>Support Team</p>
                  </div>
                  <div className='flex items-center gap-[10px]'>
                    <Checkbox checked={checkedAll} onChange={handleChangeAll} value={'all'} />
                    <p className='text-[16px] font-semibold'>All</p>
                  </div>
                </div>
                <div>
                  <p className='text-[16px] font-semibold mb-[20px]'>Type of notification</p>
                  <FormControl sx={{ minWidth: '190px' }} size='small'>
                    <InputLabel sx={{}} id='demo-select-small-label'>
                      All
                    </InputLabel>
                    <Select
                      labelId='demo-select-small-label'
                      id='demo-select-small'
                      value={typeOfNotification}
                      label='Type of notification'
                      onChange={handleFilterTypeOfNotification}
                    >
                      <MenuItem value=''>
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={7}>Thông báo phí</MenuItem>
                      <MenuItem value={30}>Tin tức</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              {/* Title */}
              <div className='mt-[20px] ml-[50px] '>
                <p className='text-[16px] font-semibold ml-[30px]  mb-[10px]'>Title</p>
                <Box
                  component='form'
                  sx={{ '& .MuiTextField-root': { width: '90%', marginLeft: '30px' } }}
                  noValidate
                  autoComplete='off'
                >
                  <div>
                    <TextField id='outlined-multiline-flexible' label='Title' multiline maxRows={2} fullWidth />
                  </div>
                </Box>
              </div>

              {/* Content */}
              <div className='mt-[20px] ml-[50px] pb-[30px]'>
                <p className='text-[16px] font-semibold ml-[30px] mb-[10px]'>Content</p>
                <Box
                  component='form'
                  sx={{ '& .MuiTextField-root': { width: '90%', marginLeft: '30px' } }}
                  noValidate
                  autoComplete='off'
                >
                  <div className=''>
                    <TextField id='outlined-multiline-static' label='Content' multiline rows={6} fullWidth />
                  </div>
                </Box>
              </div>
            </div>

            {/* Control */}
            {/* <div className='flex gap-[10px] flex-row-reverse mr-[6.5%]'>
              <Button
                variant='outlined'
                sx={{
                  borderRadius: '6px',
                  width: '130px',
                  height: '35px',
                  border: '1px solid #5382B1',
                  color: '#5382B1'
                }}
                onClick={handleCreate}
              >
                Create
              </Button>
              <Button
                variant='outlined'
                sx={{
                  borderRadius: '6px',
                  width: '130px',
                  height: '35px',
                  border: '1px solid #5382B1',
                  color: '#fff',
                  marginBottom: '20px',
                  backgroundColor: '#5382B1'
                }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div> */}
            <div className='flex justify-end gap-4 mt-6 mr-[6.5%] '>
              <Button
                variant='contained'
                onClick={() => {
                  // Xử lý logic cancel
                }}
                style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }} // Add this line
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  // Xử lý logic cancel
                }}
                style={{ color: 'white', fontWeight: 'semi-bold' }} // Add this line
              >
                Add
              </Button>
            </div>
          </div>
        </div>
        <div className='col-span-1'></div>
      </div>
    </div>
  )
}
