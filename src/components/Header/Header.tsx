import * as React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { SearchContext } from '../Search/SearchContext'
import { getProfile } from '~/apis/auth.api'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import PasswordIcon from '@mui/icons-material/Password';
interface formData {
  avatar: File
}

export default function Header() {
  const [user, setUser] = useState<formData | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile()
        setUser(response.data)
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error)
      }
    }
    fetchProfile()
  }, []) // Chạy một lần khi component mount

  const handleLogout = () => {
    localStorage.removeItem('token')
  }

  const searchContext = useContext(SearchContext)
  if (!searchContext) return null

  const { searchQuery, setSearchQuery } = searchContext

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  const getImageSrc = (image: string | File | null | undefined) => {
    if (image instanceof File) {
      return URL.createObjectURL(image)
    }
    return image || undefined
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
            value={searchQuery}
            onChange={handleChange}
            placeholder='Search'
            className='border border-gray-400 rounded-full pl-10 pr-4 py-2 w-[300px] bg-[#edf2f9] shadow-sm'
          />
        </div>
        <div className='flex gap-[30px] items-center'>
          <NotificationsIcon style={{ color: '#6C6E71' }} />
          <PopupState variant='popover' popupId='demo-popup-popover'>
            {(popupState) => (
              <div>
                <div className='w-12 h-12 rounded-full overflow-hidden cursor-pointer' {...bindTrigger(popupState)}>
                  {user?.avatar ? (
                    <img src={getImageSrc(user.avatar)} className='w-full h-full object-cover' />
                  ) : (
                    <img src='/imgs/avt/default-avt.jpg' className='w-full h-full object-cover' />
                  )}
                </div>
                <Popover
                  className='mt-3'
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  <Typography>
                    <div className='w-[180px] bg-white shadow-lg rounded-lg overflow-hidden font-semibold text-gray-500 flex flex-col'>
                      <Link
                        to='/profile'
                        onClick={() => popupState.close()}
                        className='px-4 py-1 text-l hover:bg-gray-100 transition flex items-center'
                      >
                        <AccountCircleIcon />
                        <span className='ml-4 my-2'>Profile</span>
                      </Link>
                      <hr className='border-t border-gray-300 w-full' />
                      <Link
                        to='/change-password'
                        onClick={() => popupState.close()}
                        className='px-4 py-1 text-l hover:bg-gray-100 transition flex items-center'
                      >
                        <PasswordIcon />
                        <span className='ml-4 my-2'>Password</span>
                      </Link>
                      <hr className='border-t border-gray-300 w-full' />
                      <Link
                        to='/login'
                        onClick={() => popupState.close()}
                        className='px-4 py-1 text-l hover:bg-gray-100 transition flex items-center'
                      >
                        <LogoutIcon />
                        <span className='ml-4 my-2' onClick={handleLogout}>
                          Logout
                        </span>
                      </Link>
                    </div>
                  </Typography>
                </Popover>
              </div>
            )}
          </PopupState>
          <Link to='/profile'></Link>
        </div>
      </div>
    </div>
  )
}
