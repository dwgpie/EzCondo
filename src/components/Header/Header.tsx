import * as React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Link } from 'react-router-dom'
import { useContext, useEffect, useState, useRef } from 'react'
import { SearchContext } from '../Search/SearchContext'
import { getProfile } from '~/apis/auth.api'
import { getNotification } from '~/apis/notification.api'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import Badge from '@mui/material/Badge'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import PasswordIcon from '@mui/icons-material/Password'
import * as signalR from '@microsoft/signalr'
import { format, formatDistanceToNow, isToday } from 'date-fns'

interface formData {
  avatar: File
}

interface Notification {
  id: string
  title: string
  content: string
  createdAt: string
}

export default function Header() {
  const [user, setUser] = useState<formData | null>(null)
  const [listNotification, setListNotification] = useState<Notification[]>([])
  const [type, setType] = useState('')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 6
  const [isOpen, setIsOpen] = useState(false)
  const tabs = ['all', 'notice', 'fee', 'new']
  const tabIndex = tabs.indexOf(type || 'all')
  const notificationRef = React.useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLButtonElement>(null)

  const [countNotification, setCountNotification] = useState(0)

  const [connection, setConnection] = useState<signalR.HubConnection | null>(null)
  const [messages, setMessages] = useState<string[]>([])

  const todayNotifications = listNotification.filter((n) => isToday(new Date(n.createdAt)))
  const oldNotifications = listNotification.filter((n) => !isToday(new Date(n.createdAt)))

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString)
    date.setHours(date.getHours() + 7)

    if (isToday(date)) {
      return formatDistanceToNow(date, { addSuffix: true }) // ví dụ: "3 hours ago"
    } else {
      return format(date, 'dd/MM/yyyy - HH:mm') // ví dụ: "17/04/2025 - 14:30"
    }
  }

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

  useEffect(() => {
    // Tạo kết nối đến hub backend với đường dẫn tương ứng
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://192.168.1.131:7254/notificationHub', {
        accessTokenFactory: () => localStorage.getItem('token') || ''
      }) // Đảm bảo rằng url trùng với app.MapHub<NotificationHub>("/notificationHub")
      .withAutomaticReconnect()
      .build()

    setConnection(newConnection)
  }, [])

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log('SignalR Connected.')
          // Đăng ký lắng nghe sự kiện từ backend, ví dụ như 'ReceiveNotification'
          connection.on('ReceiveNotification', (message: string) => {
            setMessages((prevMessages) => [...prevMessages, message])
            console.log('t: ', message)
            console.log('tt mới: ', messages)
            setCountNotification((prev) => prev + 1)
          })
        })
        .catch((error) => console.error('SignalR Connection Error: ', error))

      // Hủy đăng ký và dừng kết nối khi component unmount
      return () => {
        connection.stop()
      }
    }
  }, [connection])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target) &&
        bellRef.current &&
        !bellRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const fetchPageNotification = async (page: number) => {
    try {
      const res = await getNotification({
        type,
        page,
        pageSize
      })
      const newNotifies = res.data.notifications

      if (page === 1) {
        setListNotification(newNotifies)
      } else {
        setListNotification((prev) => [...prev, ...newNotifies])
      }

      setTotal(res.data.total)
    } catch (error) {
      console.error('Lỗi khi tải thông báo:', error)
    }
  }

  useEffect(() => {
    setPage(1) // reset về page 1 khi đổi loại
  }, [type])

  useEffect(() => {
    fetchPageNotification(page)
  }, [page, type])

  useEffect(() => {
    const container = notificationRef.current
    if (!isOpen || !container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        console.log('đúng hay sai: ', listNotification.length < pageSize)

        if (listNotification.length == pageSize || listNotification.length < pageSize) {
          setPage((prev) => prev + 1)
        }
      }
    }

    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen, listNotification, total])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    window.location.href = '/login'
  }

  const searchContext = useContext(SearchContext)
  if (!searchContext) return null

  const { searchQuery, setSearchQuery } = searchContext

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleNotification = () => {
    setCountNotification(0)
    setTimeout(() => {
      setIsOpen((prev) => !prev)
    }, 0)
    // setIsOpen(!isOpen)
  }
  const handelType = (type: string) => {
    if (type === 'all') {
      setType('')
    } else {
      setType(type)
    }
  }

  const getImageSrc = (image: string | File | null | undefined) => {
    if (image instanceof File) {
      return URL.createObjectURL(image)
    }
    return image || undefined
  }

  return (
    <div className='bg-[#fff] h-[80px]  w-full pl-[20px] pr-[20px] border-b-[3px] border-gray-300 z-50'>
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
        <div className='flex gap-[30px] items-center transition-all duration-300'>
          <button ref={bellRef} onClick={handleNotification} className='relative cursor-pointer'>
            <Badge badgeContent={countNotification} color='primary'>
              <NotificationsIcon style={{ color: '#6C6E71' }} />
            </Badge>
          </button>
          {isOpen == true ? (
            <div
              ref={notificationRef}
              className='absolute w-[350px]  bg-[white] right-[10px] top-18 border-[2px] rounded-[25px] shadow-lg'
            >
              <div className='sticky w-[346px]'>
                <div className='flex justify-between bg-white items-center pt-[10px] pr-[20px] pl-[20px] rounded-t-[25px]'>
                  <h1 className='font-medium text-[26px] text-[#000] font-extrabold'>Notification</h1>
                  <Link to='/manager/history-notification'>
                    <a className='text-[#0854a0] font-medium'>View all</a>
                  </Link>
                </div>
                <div className='relative bg-white'>
                  <div className='flex border-b-[2px] border-b-[#939393]'>
                    {tabs.map((tab, index) => (
                      <button
                        key={tab}
                        className={`flex-1 text-center font-medium py-2 cursor-pointer transition-all duration-300 ${
                          type === tab || (type === '' && index === 0) ? 'text-[#0854a0]' : 'text-[#7a8699]'
                        } `}
                        onClick={() => handelType(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Underline bar */}
                <div
                  className='absolute bottom-0 left-0 h-[3px] bg-[#0854a0] transition-all duration-300'
                  style={{
                    width: '25%',
                    transform: `translateX(${tabIndex * 100}%)`
                  }}
                />
              </div>
              <div className='h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar'>
                {/* Hôm nay */}
                {todayNotifications.length > 0 && (
                  <>
                    <p className='text-[16px] font-semibold text-[#a9a9a9] p-[5px] bg-[#f5fbff]'>Today</p>
                    {todayNotifications.map((notify) => (
                      <div key={notify.id} className='p-[10px] border-b-[1px] border-b-[#d6d6d6]'>
                        <p className='font-bold text-[#333]'>{notify.title}</p>
                        <p className='text-[#7b7b7b]'>{notify.content}</p>
                        <div className='flex justify-end mt-[5px]'>
                          <p className='text-[#7b7b7b]'>{formatNotificationTime(notify.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Những ngày trước */}
                {oldNotifications.length > 0 && (
                  <>
                    <p className='text-[16px] font-semibold text-[#a9a9a9] p-[5px] bg-[#f5fbff]'>Previous days</p>
                    {oldNotifications.map((notify) => (
                      <div key={notify.id} className='p-[10px] border-b-[1px] border-b-[#d6d6d6]'>
                        <p className='font-bold text-[#333]'>{notify.title}</p>
                        <p className='text-[#7b7b7b]'>{notify.content}</p>
                        <div className='flex justify-end mt-[5px]'>
                          <p className='text-[#7b7b7b]'>{formatNotificationTime(notify.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Trường hợp không có gì */}
                {listNotification.length === 0 && <p className='p-[10px]'>No notification Foundation</p>}
              </div>
              {/* {listNotification.length < total && (
                <div className='text-center text-sm text-gray-500 py-2'>Đang tải thêm...</div>
              )} */}
            </div>
          ) : (
            ''
          )}
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
                      <div
                        onClick={() => {
                          popupState.close()
                          handleLogout()
                        }}
                        className='px-4 py-1 text-l hover:bg-gray-100 transition flex items-center cursor-pointer'
                      >
                        <LogoutIcon />
                        <span className='ml-4 my-2'>Logout</span>
                      </div>
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
