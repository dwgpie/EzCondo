import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'

export default function Header() {
  return (
    <header className='bg-[#EDF2F9E6] h-[80px] fixed top-0 left-0 w-full z-10'>
      <div className='grid grid-cols-12 gap-2 items-center'>
        <div className='col-span-1'></div>
        <div className='col-span-2'>
          <div className='w-20 h-20 overflow-hidden flex ml-20 z-100'>
            <img src='/public/imgs/logo/main-logo.png' className='w-full h-full object-cover' />
          </div>
        </div>
        <div className='col-span-8 flex items-center justify-between border-b-[3px] border-gray-300 h-[80px]'>
          <div className='relative flex items-center'>
            <span className='absolute left-3 text-gray-400'>
              <SearchIcon />
            </span>
            <input
              type='text'
              placeholder='Search'
              className='border border-gray-400 rounded-full pl-10 pr-4 py-2 w-[300px] bg-white shadow-sm'
            />
          </div>
          <div className='flex justify-center items-center'>
            <NotificationsIcon style={{ color: '#6C6E71' }} />
            <div className='w-10 h-10 rounded-full overflow-hidden ml-2'>
              <img src='/public/imgs/avt/avatar-vo-tri-meo-1.jpg' className='w-full h-full object-cover' />
            </div>
          </div>
        </div>
        <div className='col-span-1'></div>
      </div>
    </header>
  )
}
