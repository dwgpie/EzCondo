import * as React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Link } from 'react-router-dom'
import { useContext, useEffect, useState, useRef } from 'react'
import { SearchContext } from '../../contexts/SearchContext'
import { markAsRead, receiveNotification } from '~/apis/notification.api'
import Popover from '@mui/material/Popover'
import Badge from '@mui/material/Badge'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import * as signalR from '@microsoft/signalr'
import { format, formatDistanceToNow, isToday } from 'date-fns'
import { useUser } from '../../contexts/UserContext'
import LanguageSwitcher from '../LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import Weather from '../Weather'

interface Notification {
  id: string
  title: string
  content: string
  type: string
  createdAt: string
  isRead: boolean
}

export default function Header() {
  const API_BASE_URL = import.meta.env.VITE_API_URL
  const { t } = useTranslation('header')
  const [listNotification, setListNotification] = useState<Notification[]>([])
  const [isReadAll, setIsReadAll] = useState<string[]>([])
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [isOpen, setIsOpen] = useState(false)
  const tabs = ['all', 'notice', 'incident']
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

  const { avatar } = useUser()

  useEffect(() => {
    // Tạo kết nối đến hub backend với đường dẫn tương ứng
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/notificationHub`, {
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

  const fetchNotifications = async (page: number) => {
    try {
      const res = await receiveNotification({
        type,
        page,
        pageSize
      })
      const newNotifies = res.data.notifications

      const ids = res.data.notifications.map((item: Notification) => item.id)
      console.log(ids)
      setIsReadAll(ids)
      if (page === 1) {
        setListNotification(newNotifies)
      } else {
        setListNotification((prev) => [...prev, ...newNotifies])
      }
    } catch (error) {
      console.error('Lỗi khi tải thông báo:', error)
    }
  }

  const fetchIsReadAllNotification = async () => {
    try {
      console.log('đọc')
      await markAsRead({
        notificationIds: isReadAll
      })
      fetchNotifications(page)
    } catch (error) {
      console.error('Lỗi đọc thông báo:', error)
    }
  }

  const fetchIsReadNotification = async (id: string) => {
    try {
      await markAsRead({
        notificationIds: [id]
      })
      fetchNotifications(page)
    } catch (error) {
      console.error('Lỗi đọc thông báo:', error)
    }
  }

  useEffect(() => {
    setPage(1) // reset về page 1 khi đổi loại
  }, [type])

  useEffect(() => {
    fetchNotifications(page)
  }, [page, type, isOpen])

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

  const getTypeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'notice':
        return 'bg-gradient-to-r from-green-200 to-green-300 text-green-700 font-semibold rounded-lg shadow-sm'
      case 'fee':
        return 'bg-gradient-to-r from-green-200 to-green-300 text-green-700 font-semibold rounded-lg shadow-sm'
      case 'new':
        return 'bg-gradient-to-r from-green-200 to-green-300 text-green-700 font-semibold rounded-lg shadow-sm'
      case 'incident':
        return 'bg-gradient-to-r from-red-200 to-red-300 text-red-700 font-semibold rounded-lg shadow-sm'
    }
  }

  return (
    <div className='bg-blue-50 h-[80px] w-full pl-[20px] pr-[20px] border-b-2 border-[#eaeaea] z-50'>
      <div className='flex items-center justify-between w-full h-[80px]'>
        <div className='relative flex items-center ml-3'>
          <span className='absolute left-3 text-gray-400'>
            <SearchIcon />
          </span>
          <input
            type='text'
            value={searchQuery}
            onChange={handleChange}
            placeholder={t('search')}
            className='border border-gray-300 rounded-full pl-10 pr-4 py-2 w-[300px] bg-[#fff] shadow-sm 
            focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 
            transition duration-200 ease-in-out hover:border-blue-400'
          />
        </div>

        <div className='flex gap-[20px] items-center transition-all duration-300'>
          <Weather />
          <div className='ml-5'>
            <LanguageSwitcher />
          </div>
          {localStorage.getItem('role') === 'manager' && (
            <button ref={bellRef} onClick={handleNotification} className='relative cursor-pointer'>
              <Badge badgeContent={countNotification} color='primary' overlap='circular'>
                <div
                  className={`relative p-2 rounded-full border cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg active:scale-95
                ${isOpen ? 'bg-blue-100 border-blue-400 text-blue-600 animate-[wiggle_0.6s]' : 'bg-white border-gray-300 text-gray-700 shadow-sm'}`}
                  style={{
                    animationTimingFunction: 'ease-in-out'
                  }}
                >
                  {countNotification > 0 && (
                    <span className='absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-400 opacity-70 animate-ping'></span>
                  )}

                  <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24'>
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
            className={`absolute w-[350px] bg-white right-[110px] top-18.5 border border-[#eaeaea] rounded-[10px] shadow-lg transition-all duration-500 ease-in-out origin-top transform ${
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
                      {t(`tabs.${tab}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Underline bar */}
              <div
                className='absolute bottom-0 left-0 h-[3px] bg-[#0854a0] transition-all duration-300'
                style={{
                  width: '33.33%',
                  transform: `translateX(${tabIndex * 100}%)`
                }}
              />
            </div>
            <div className='h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar'>
              {/* Hôm nay */}
              {todayNotifications.length > 0 && (
                <>
                  <div className='bg-[linear-gradient(to_right,_#f2fcfe_0%,_#d0f4ff_70%,_#9cdcff_100%)]'>
                    <p className='text-[14px] font-semibold text-[#1B2124] p-[5px] pl-[10px] '>{t('today')}</p>
                  </div>
                  {todayNotifications.map((notify) => (
                    <Link
                      key={notify.id}
                      to={
                        notify.type === 'incident'
                          ? '/manager/list-incident'
                          : notify.type === 'notice'
                            ? '/manager/history-notification'
                            : '#'
                      }
                      onClick={() => {
                        fetchIsReadNotification(notify.id)
                        setIsOpen(false)
                      }}
                    >
                      <div key={notify.id} className='relative hover:bg-[#f1f3f5]'>
                        <div className='p-[10px] '>
                          <div className='flex justify-between ml-[15px]'>
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
                            className='text-[#4D595E] overflow-hidden text-ellipsis ml-[15px]'
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
                    </Link>
                  ))}
                </>
              )}

              {/* Những ngày trước */}
              {oldNotifications.length > 0 && (
                <>
                  <div className='bg-[linear-gradient(to_right,_#f2fcfe_0%,_#d0f4ff_70%,_#9cdcff_100%)]'>
                    <p className='text-[14px] font-semibold text-[#1B2124] p-[5px] pl-[10px] '>{t('older')}</p>
                  </div>
                  {oldNotifications.map((notify) => (
                    <Link
                      key={notify.id}
                      to={
                        notify.type === 'incident'
                          ? '/manager/list-incident'
                          : notify.type === 'notice'
                            ? '/manager/history-notification'
                            : '#'
                      }
                      onClick={() => setIsOpen(false)}
                    >
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
                    </Link>
                  ))}
                </>
              )}

              {/* Trường hợp không có gì */}
              {listNotification.length === 0 && <p className='p-[10px] flex justify-center'>{t('no_notifications')}</p>}
            </div>
            <div className='flex flex-col align-center items-center pt-[5px] pb-[5px]'>
              <button
                className='block text-[#3385F0] font-medium text-center pt-[5px] pb-[5px] w-[200px] hover:bg-[#3385f01f] rounded-[10px]'
                onClick={() => fetchIsReadAllNotification()}
              >
                {t('read_all')}
              </button>
            </div>
            {/* {listNotification.length < total && (
                <div className='text-center text-sm text-gray-500 py-2'>Đang tải thêm...</div>
              )} */}
          </div>

          <PopupState variant='popover' popupId='demo-popup-popover'>
            {(popupState) => (
              <div className=''>
                <div
                  className={`w-14 h-14 rounded-full overflow-hidden cursor-pointer border-1 transition-all duration-300 ${
                    popupState.isOpen ? 'border-[#3385f0]' : 'border-[#d1d1d1]'
                  }`}
                  {...bindTrigger(popupState)}
                >
                  <img
                    src={avatar || '/imgs/avt/default-avt.jpg'}
                    alt='User avatar'
                    className='w-full h-full object-cover'
                  />
                </div>
                <Popover
                  className='mt-[6px]'
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  sx={{
                    '& .MuiPaper-root': {
                      borderRadius: '10px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                      overflow: 'hidden',
                      border: '1px solid #eaeaea'
                    }
                  }}
                >
                  <div className='w-[180px] bg-white overflow-hidden font-semibold text-gray-500 flex flex-col'>
                    <Link
                      to='/profile'
                      onClick={() => popupState.close()}
                      className={`px-4 py-1 text-l transition flex items-center ${
                        location.pathname === '/profile' ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'
                      }`}
                    >
                      <div className='w-7 h-7 rounded-full overflow-hidden cursor-pointer'>
                        <img
                          src={avatar || '/imgs/avt/default-avt.jpg'}
                          alt='User avatar'
                          className={`w-full h-full object-cover rounded-full ${
                            location.pathname === '/profile' ? 'border-1 border-[#3385f0]' : 'border-1 border-[#eaeaea]'
                          }`}
                        />
                      </div>
                      <span className='ml-3 my-2'>{t('profile')}</span>
                    </Link>
                    <hr className='border-t border-gray-300 w-full' />
                    <Link
                      to='/change-password'
                      onClick={() => popupState.close()}
                      className={`px-4 py-1 text-l transition flex items-center ${
                        location.pathname === '/change-password' ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'
                      }`}
                    >
                      <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                        <path
                          fill='none'
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeWidth='1.5'
                          d='M12 10v4m-1.732-3l3.464 2m0-2l-3.465 2m-3.535-3v4M5 11l3.464 2m0-2L5 13m12.268-3v4m-1.732-3L19 13m0-2l-3.465 2M22 12c0 3.771 0 5.657-1.172 6.828S17.771 20 14 20h-4c-3.771 0-5.657 0-6.828-1.172S2 15.771 2 12s0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172c.654.653.943 1.528 1.07 2.828'
                        />
                      </svg>
                      <span className='ml-4 my-2'>{t('password')}</span>
                    </Link>
                    <hr className='border-t border-gray-300 w-full' />
                    <div
                      onClick={() => {
                        popupState.close()
                        handleLogout()
                      }}
                      className='px-4 py-1 text-l hover:bg-[#fdeaea] hover:text-[#f03333] transition flex items-center cursor-pointer'
                    >
                      <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                        <path
                          fill='none'
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M20 12h-9.5m7.5 3l3-3l-3-3m-5-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-1'
                        />
                      </svg>
                      <span className='ml-4 my-2'>{t('logout')}</span>
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
