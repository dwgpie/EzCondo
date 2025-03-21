import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Link } from 'react-router-dom'

export default function Header() {
  const handleLogout = () => {
    localStorage.removeItem('token')
  }

  return (
    <div className='bg-[#fff] h-[80px]  w-full pl-[20px] pr-[20px] border-b-[3px] border-gray-300 sticky top-0 z-50'>
      <div className='flex items-center justify-between w-full  h-[80px]'>
        <div className='relative flex items-center w-[40%]'>
          <span className='absolute left-3 text-gray-400'>
            <SearchIcon />
          </span>
          <input
            type='text'
            placeholder='Search'
            className='border border-gray-400 rounded-full pl-10 pr-4 py-2 w-[300px] bg-[#edf2f9] shadow-sm'
          />
        </div>
        <div className='flex gap-[30px] items-center'>
          <Link to='/login'>
            <button onClick={handleLogout}>Logout</button>
          </Link>
          <NotificationsIcon style={{ color: '#6C6E71' }} />
          <div className='w-10 h-10 rounded-full overflow-hidden ml-2'>
            <img src='/public/imgs/avt/avatar-vo-tri-meo-1.jpg' className='w-full h-full object-cover' />
          </div>
        </div>
      </div>
    </div>
  )
}
