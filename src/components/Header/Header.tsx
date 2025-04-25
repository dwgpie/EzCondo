import * as React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Link } from 'react-router-dom'
import { useContext, useEffect, useState, useRef } from 'react'
import { SearchContext } from '../Search/SearchContext'
import { getProfile } from '~/apis/auth.api'
import { receiveNotification } from '~/apis/notification.api'
import Popover from '@mui/material/Popover'
import Badge from '@mui/material/Badge'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import PasswordIcon from '@mui/icons-material/Password'
import * as signalR from '@microsoft/signalr'
import { format, formatDistanceToNow, isToday } from 'date-fns'
import '../SideBar/SideBar.css'

interface formData {
  avatar: File
}

interface Notification {
  id: string
  title: string
  content: string
  type: string
  createdAt: string
  isRead: boolean
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
      .withUrl('http://localhost:7254/notificationHub', {
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
      const res = await receiveNotification({
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

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'incident':
        return 'bg-red-200 text-red-800'
      case 'fee':
        return 'bg-orange-200 text-orange-800'
      case 'new':
        return 'bg-green-200 text-green-800'
      case 'notice':
        return 'bg-green-200 text-green-800'
      default:
        return ''
    }
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
        <div className='flex gap-[20px] items-center transition-all duration-300'>
          {localStorage.getItem('role') === 'manager' && (
            <button ref={bellRef} onClick={handleNotification} className='relative cursor-pointer'>
              <Badge badgeContent={countNotification} color='primary'>
                <div className='p-2 text-gray-600 bg-[#ebf2f5] rounded-full shadow-lg hover:bg-[#eaf3fd] hover:text-[#3385f0] transition-all duration-300 ripple'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='19' height='19' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      fillRule='evenodd'
                      d='M12 1.25A7.75 7.75 0 0 0 4.25 9v.704a3.53 3.53 0 0 1-.593 1.958L2.51 13.385c-1.334 2-.316 4.718 2.003 5.35q1.133.309 2.284.523l.002.005C7.567 21.315 9.622 22.75 12 22.75s4.433-1.435 5.202-3.487l.002-.005a29 29 0 0 0 2.284-.523c2.319-.632 3.337-3.35 2.003-5.35l-1.148-1.723a3.53 3.53 0 0 1-.593-1.958V9A7.75 7.75 0 0 0 12 1.25m3.376 18.287a28.5 28.5 0 0 1-6.753 0c.711 1.021 1.948 1.713 3.377 1.713s2.665-.692 3.376-1.713M5.75 9a6.25 6.25 0 1 1 12.5 0v.704c0 .993.294 1.964.845 2.79l1.148 1.723a2.02 2.02 0 0 1-1.15 3.071a26.96 26.96 0 0 1-14.187 0a2.02 2.02 0 0 1-1.15-3.07l1.15-1.724a5.03 5.03 0 0 0 .844-2.79z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </Badge>
            </button>
          )}

          <div
            ref={notificationRef}
            className={`absolute w-[350px] bg-white right-[10px] top-18 border border-[#7a8699] rounded-[10px] shadow-lg transition-all duration-500 ease-in-out origin-top transform ${
              isOpen
                ? 'opacity-100 scale-100 translate-y-0 visible'
                : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
            }`}
          >
            <div className='sticky w-[346px]'>
              <div className='relative rounded-[10px] bg-white'>
                <div className='flex'>
                  {tabs.map((tab, index) => (
                    <button
                      key={tab}
                      className={`flex-1 text-center font-medium py-2 cursor-pointer transition-all duration-300 hover:bg-[#3385f01f] ${
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
                  <p className='text-[14px] font-semibold text-[#1B2124] p-[5px] pl-[10px]'>Today</p>
                  {todayNotifications.map((notify) => (
                    <div key={notify.id} className='relative hover:bg-[#f1f3f5]'>
                      <div className='p-[10px] '>
                        <div className='flex justify-between ml-[20px]'>
                          <p
                            className='font-bold text-[#1B2124] overflow-hidden text-ellipsis'
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {notify.title}
                          </p>

                          <div
                            className={`${getTypeColor(notify.type)} w-[80px] h-fit px-2 py-1 rounded-full text-sm font-semibold text-center`}
                          >
                            <span>{notify.type}</span>
                          </div>
                        </div>
                        <p
                          className='text-[#4D595E] overflow-hidden text-ellipsis ml-[20px]'
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {notify.content}
                        </p>
                        <div className='flex justify-end mt-[5px]'>
                          <p className='text-[#4D595E] text-[12px]'>{formatNotificationTime(notify.createdAt)}</p>
                        </div>
                      </div>
                      {!notify.isRead && (
                        <div className='absolute w-[7px] h-[7px] bg-[#D02241] rounded-[50%] top-[20px] left-[10px]'></div>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Những ngày trước */}
              {oldNotifications.length > 0 && (
                <>
                  <p className='text-[14px] font-semibold text-[#1B2124] p-[5px] pl-[10px]'>Older</p>
                  {oldNotifications.map((notify) => (
                    <div key={notify.id} className='relative hover:bg-[#f1f3f5]'>
                      <div className='p-[10px] '>
                        <div className='flex justify-between ml-[20px]'>
                          <p
                            className='font-bold text-[#1B2124] overflow-hidden text-ellipsis'
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {notify.title}
                          </p>

                          <div
                            className={`${getTypeColor(notify.type)} w-[80px] h-fit px-2 py-1 rounded-full text-sm font-semibold text-center`}
                          >
                            <span>{notify.type}</span>
                          </div>
                        </div>
                        <p
                          className='text-[#4D595E] overflow-hidden text-ellipsis ml-[20px]'
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {notify.content}
                        </p>
                        <div className='flex justify-end mt-[5px]'>
                          <p className='text-[#4D595E] text-[12px]'>{formatNotificationTime(notify.createdAt)}</p>
                        </div>
                      </div>
                      {!notify.isRead && (
                        <div className='absolute w-[7px] h-[7px] bg-[#D02241] rounded-[50%] top-[20px] left-[10px]'></div>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Trường hợp không có gì */}
              {listNotification.length === 0 && <p className='p-[10px]'>No notification Foundation</p>}
            </div>
            <div className='flex flex-col align-center items-center pt-[5px] pb-[5px]'>
              <Link
                to='/manager/history-notification'
                className='block text-[#3385F0] font-medium text-center pt-[5px] pb-[5px] w-[200px] hover:bg-[#3385f01f] rounded-[10px]'
              >
                View all
              </Link>
            </div>
            {/* {listNotification.length < total && (
                <div className='text-center text-sm text-gray-500 py-2'>Đang tải thêm...</div>
              )} */}
          </div>

          <PopupState variant='popover' popupId='demo-popup-popover'>
            {(popupState) => (
              <div>
                <div
                  className='w-12 h-12 rounded-full overflow-hidden cursor-pointer shadow-lg'
                  {...bindTrigger(popupState)}
                >
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
