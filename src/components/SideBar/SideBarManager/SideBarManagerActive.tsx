import { useState } from 'react'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'
import '../SideBar.css'
import { useTranslation } from 'react-i18next'

export default function SideBarManagerActive() {
  const location = useLocation()
  const path = location.pathname
  const { t } = useTranslation('sidebarmanager')

  const DashboardPath = '/manager/dashboard'
  const ListUserPath = '/manager/list-resident'
  const HistoryNotificationPath = '/manager/history-notification'
  const AddNotificationPath = '/manager/add-notification'

  const ElectricMeterPath = '/manager/add-electricity-meter'
  const ElectricicReadingPath = '/manager/add-electricity-reading'
  const ElectricUnpaidPath = '/manager/unpaid-electricity'

  const WaterMeterPath = '/manager/add-water-meter'
  const WaterReadingPath = '/manager/add-water-reading'
  const WaterUnpaidPath = '/manager/unpaid-water'

  const ListIncidentPath = '/manager/list-incident'

  const RequestParkingPath = '/manager/request-parking'
  const ListParkingPath = '/manager/list-parking'
  const ParkingUnpaidPath = '/manager/unpaid-parking'

  const PaymentHistoryPath = '/manager/payment-history'
  const BookingHistoryPath = '/manager/booking-history'

  const FeedbackPath = '/manager/feedback'

  const [isOpenUser, setIsOpenUser] = useState(false)
  const [isOpenElectric, setIsOpenElectric] = useState(false)
  const [isOpenWater, setIsOpenWater] = useState(false)
  const [isOpenNotification, setIsOpenNotification] = useState(false)
  const [isOpenIncident, setIsOpenIncident] = useState(false)
  const [isOpenParking, setIsOpenParking] = useState(false)
  const [isTransactionHistory, setIsTransactionHistory] = useState(false)
  const [isOpenFeedback, setIsOpenFeedback] = useState(false)

  const handleClickUser = () => {
    setIsOpenUser(!isOpenUser)
  }
  const handleClickElectric = () => {
    setIsOpenElectric(!isOpenElectric)
  }
  const handleClickWater = () => {
    setIsOpenWater(!isOpenWater)
  }
  const handleClickNotification = () => {
    setIsOpenNotification(!isOpenNotification)
  }
  const handleClickIncident = () => {
    setIsOpenIncident(!isOpenIncident)
  }
  const handleClickParking = () => {
    setIsOpenParking(!isOpenParking)
  }

  const handleClickTransactionHistory = () => {
    setIsTransactionHistory(!isTransactionHistory)
  }

  const handleClickFeedback = () => {
    setIsOpenFeedback(!isOpenFeedback)
  }

  return (
    <div className='flex flex-col items-center bg-blue-50 mb-10 w-full h-screen border-r-2 border-[#eaeaea] text-gray-700 overflow-hidden'>
      <Link to='/manager/dashboard'>
        <div className='flex items-center gap-3 group mt-2 px-4 py-2 transition-all duration-300 hover:bg-blue-100 rounded-lg mb-3'>
          <div className='relative w-12 h-12'>
            <div className='absolute inset-0 bg-blue-500 rounded-lg rotate-45 group-hover:rotate-[135deg] transition-all duration-700 ease-in-out'></div>
            <div className='absolute inset-0 bg-blue-500 rounded-lg -rotate-45 group-hover:rotate-0 transition-all duration-700 ease-in-out'></div>
            <div className='absolute inset-0 flex items-center justify-center'>
              <img
                src='/imgs/logo/logo-mini.png'
                alt='EzCondo Logo'
                className='w-10 h-10 object-cover group-hover:scale-105 transition-all duration-700 ease-in-out brightness-0 invert'
              />
            </div>
          </div>
          <div className='flex flex-col'>
            <h2 className='text-2xl font-black tracking-tight text-gray-800 group-hover:text-blue-600 transition-all duration-300'>
              Ez<span className='text-blue-500 group-hover:text-gray-800 transition-colors duration-300'>Condo</span>
            </h2>
            <span className='text-[10px] text-gray-600 font-medium tracking-wider group-hover:text-blue-500 transition-colors duration-300'>
              {t('slogan')}
            </span>
          </div>
        </div>
      </Link>

      <div className='custom-scroll'>
        {/* Dashboard */}
        <div className='flex items-center justify-between gap-[10px] h-[45px] px-5'>
          <p className='text-[13px] text-blue-600 mt-2 mb-2'>{t('homepage')}</p>
          <div className='w-[66%] h-[1px] bg-blue-500'></div>
        </div>
        <Link to='/manager/dashboard'>
          <div
            className={`flex justify-between px-4 ml-5 mr-2 h-[45px] rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === DashboardPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
          >
            <div className='flex justify-center items-center gap-x-[11px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'>
                <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5'>
                  <path d='M6.133 21C4.955 21 4 20.02 4 18.81v-8.802c0-.665.295-1.295.8-1.71l5.867-4.818a2.09 2.09 0 0 1 2.666 0l5.866 4.818c.506.415.801 1.045.801 1.71v8.802c0 1.21-.955 2.19-2.133 2.19z' />
                  <path d='M9.5 21v-5.5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2V21' />
                </g>
              </svg>
              <p className='text-[15px]'>{t('dashboard')}</p>
            </div>
          </div>
        </Link>

        <div className='flex items-center justify-between gap-[10px] h-[45px] px-6'>
          <p className='text-[13px] text-blue-600 mt-2 mb-2'>{t('features')}</p>
          <div className='w-[66%] h-[1px] bg-blue-500'></div>
        </div>

        <div className='w-full'>
          {/* User */}
          <div
            className={`flex justify-between px-2 pl-2.5 ml-5 mr-2 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ListUserPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
            onClick={handleClickUser}
          >
            <div className='flex justify-center items-center gap-x-[5px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 30 30' className='ml-2'>
                <g fill='none' stroke='currentColor' strokeWidth='1.5'>
                  <circle cx='12' cy='6' r='4' />
                  <path d='M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z' />
                </g>
              </svg>
              <p className='text-[15px]'>{t('user')}</p>
            </div>
            <div className='flex items-center justify-center'>{isOpenUser ? <ExpandLess /> : <ExpandMore />}</div>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isOpenUser ? 'max-h-[100px]' : 'max-h-0'}`}>
            <Link to='/manager/list-resident'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ListUserPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[14px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 250 250'>
                    <path
                      fill='currentColor'
                      d='M152 80a8 8 0 0 1 8-8h88a8 8 0 0 1 0 16h-88a8 8 0 0 1-8-8m96 40h-88a8 8 0 0 0 0 16h88a8 8 0 0 0 0-16m0 48h-64a8 8 0 0 0 0 16h64a8 8 0 0 0 0-16m-96.25 22a8 8 0 0 1-5.76 9.74a7.6 7.6 0 0 1-2 .26a8 8 0 0 1-7.75-6c-6.16-23.94-30.34-42-56.25-42s-50.09 18.05-56.25 42a8 8 0 0 1-15.5-4c5.59-21.71 21.84-39.29 42.46-48a48 48 0 1 1 58.58 0c20.63 8.71 36.88 26.29 42.47 48M80 136a32 32 0 1 0-32-32a32 32 0 0 0 32 32'
                    />
                  </svg>
                  <p className='text-[15px]'>{t('resident_list')}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Electricity */}
          <div
            className={`flex justify-between px-2 ml-5 mr-2 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ElectricMeterPath || path === ElectricicReadingPath || path === ElectricUnpaidPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
            onClick={handleClickElectric}
          >
            <div className='flex justify-center items-center gap-x-[3px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='37' height='34' viewBox='0 0 24 20' className='ml-2'>
                <path
                  fill='currentColor'
                  fillRule='evenodd'
                  d='M15 8.5h-3.813l2.273-5.303A.5.5 0 0 0 13 2.5H8a.5.5 0 0 0-.46.303l-3 7A.5.5 0 0 0 5 10.5h2.474l-2.938 7.314c-.2.497.417.918.807.55l5.024-4.743l4.958-4.241A.5.5 0 0 0 15 8.5m-4.571 1h3.217l-3.948 3.378l-3.385 3.195l2.365-5.887a.5.5 0 0 0-.464-.686H5.758l2.572-6h3.912L9.969 8.803a.5.5 0 0 0 .46.697'
                  clipRule='evenodd'
                />
              </svg>
              <p className='text-[15px]'>{t('electricity')}</p>
            </div>
            <div className='flex items-center justify-center'>{isOpenElectric ? <ExpandLess /> : <ExpandMore />}</div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${isOpenElectric ? 'max-h-[150px]' : 'max-h-0'}`}
          >
            <Link to='/manager/add-electricity-meter'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ElectricMeterPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[8px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M9 21.95v-2.5q-2.65-.925-4.325-3.237T3 10.95q0-1.875.713-3.512t1.924-2.85t2.85-1.925t3.488-.713t3.5.713t2.875 1.925t1.938 2.85T21 10.95q0 2.95-1.687 5.238T15 19.425v2.525h-2V19.9q-.25.05-.5.05h-.525q-.25 0-.488-.012T11 19.9v2.05zM12 18q2.9 0 4.95-2.05T19 11t-2.05-4.95T12 4T7.05 6.05T5 11t2.05 4.95T12 18M8 9h8V7H8zm3.25 8l3-3L13 12.75l1.25-1.25l-1.5-1.5l-3 3L11 14.25L9.75 15.5zm.75-6'
                    />
                  </svg>
                  <p className='text-[15px]'>{t('electricity_meter')}</p>
                </div>
              </div>
            </Link>

            <Link to='/manager/add-electricity-reading'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 mt-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ElectricicReadingPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[12px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M15 9h1V7.5h4V9h1c.55 0 1 .45 1 1v11c0 .55-.45 1-1 1h-6c-.55 0-1-.45-1-1V10c0-.55.45-1 1-1m1 2v3h4v-3zm-4-5.31l-5 4.5V18h5v2H5v-8H2l10-9l2.78 2.5H14v1.67l-.24.1z'
                    />
                  </svg>
                  <p className='text-[15px]'>{t('electricity_reading')}</p>
                </div>
              </div>
            </Link>

            <Link to='/manager/unpaid-electricity'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ElectricUnpaidPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[17px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 0 16 16'>
                    <path
                      fill='currentColor'
                      fillRule='evenodd'
                      d='M5 1a.75.75 0 0 1 .75.75V3h5V1.75a.75.75 0 0 1 1.5 0V3H14a1 1 0 0 1 1 1v4.25a.75.75 0 0 1-1.5 0V7.5h-11v6h5.75a.75.75 0 0 1 0 1.5H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.25V1.75A.75.75 0 0 1 5 1M2.5 6h11V4.5h-11zm8.78 4.22a.75.75 0 1 0-1.06 1.06L11.94 13l-1.72 1.72a.75.75 0 1 0 1.06 1.06L13 14.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L14.06 13l1.72-1.72a.75.75 0 1 0-1.06-1.06L13 11.94z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <p className='text-[15px]'>{t('unpaid_electricity')}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Water */}
          <div
            className={`flex justify-between px-2 ml-5 mr-2 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === WaterMeterPath || path === WaterReadingPath || path === WaterUnpaidPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
            onClick={handleClickWater}
          >
            <div className='flex justify-center items-center gap-x-[11px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 512 512' className='ml-2'>
                <path
                  fill='none'
                  stroke='currentColor'
                  strokeMiterlimit='10'
                  strokeWidth='32'
                  d='M400 320c0 88.37-55.63 144-144 144s-144-55.63-144-144c0-94.83 103.23-222.85 134.89-259.88a12 12 0 0 1 18.23 0C296.77 97.15 400 225.17 400 320Z'
                />
                <path
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='32'
                  d='M344 328a72 72 0 0 1-72 72'
                />
              </svg>
              <p className='text-[15px]'>{t('water')}</p>
            </div>
            <div className='flex items-center justify-center'>{isOpenWater ? <ExpandLess /> : <ExpandMore />}</div>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isOpenWater ? 'max-h-[150px]' : 'max-h-0'}`}>
            <Link to='/manager/add-water-meter'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === WaterMeterPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[13px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 2a8 8 0 0 1 8 8c0 2.4-1 4.5-2.7 6c-1.4-1.3-3.3-2-5.3-2s-3.8.7-5.3 2C5 16.5 4 14.4 4 12a8 8 0 0 1 8-8m2 1.89c-.38.01-.74.26-.9.65l-1.29 3.23l-.1.23c-.71.13-1.3.6-1.57 1.26c-.41 1.03.09 2.19 1.12 2.6s2.19-.09 2.6-1.12c.26-.66.14-1.42-.29-1.98l.1-.26l1.29-3.21l.01-.03c.2-.51-.05-1.09-.56-1.3c-.13-.05-.26-.07-.41-.07M10 6a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1M7 9a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m10 0a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1'
                    />
                  </svg>
                  <p className='text-[15px]'>{t('water_meter')}</p>
                </div>
              </div>
            </Link>

            <Link to='/manager/add-water-reading'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 mt-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === WaterReadingPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[13px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M4 22V4h5V2h2v2h2V2h2v2h5v18zm2-2h12V6H6zm2-10h8V8H8zm4 8q1.05 0 1.775-.712t.725-1.738q0-.825-.475-1.412T12 11.75q-1.575 1.8-2.037 2.4t-.463 1.4q0 1.025.725 1.738T12 18m-6 2V6z'
                    />
                  </svg>
                  <p className='text-[15px]'>{t('water_reading')}</p>
                </div>
              </div>
            </Link>
            <Link to='/manager/unpaid-water'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === WaterUnpaidPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[17px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 0 16 16'>
                    <path
                      fill='currentColor'
                      fillRule='evenodd'
                      d='M5 1a.75.75 0 0 1 .75.75V3h5V1.75a.75.75 0 0 1 1.5 0V3H14a1 1 0 0 1 1 1v4.25a.75.75 0 0 1-1.5 0V7.5h-11v6h5.75a.75.75 0 0 1 0 1.5H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.25V1.75A.75.75 0 0 1 5 1M2.5 6h11V4.5h-11zm8.78 4.22a.75.75 0 1 0-1.06 1.06L11.94 13l-1.72 1.72a.75.75 0 1 0 1.06 1.06L13 14.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L14.06 13l1.72-1.72a.75.75 0 1 0-1.06-1.06L13 11.94z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <p className='text-[15px]'>{t('unpaid_water')}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Parking */}
          <div
            className={`flex justify-between px-2 pl-4 ml-5 mr-2 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ListParkingPath || path === RequestParkingPath || path === ParkingUnpaidPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
            onClick={handleClickParking}
          >
            <div className='flex justify-center items-center gap-x-[13px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 15 15'>
                <path fill='currentColor' d='M4 2v11h2V9h2.5a3.5 3.5 0 1 0 0-7zm2 5V4h2.5a1.5 1.5 0 1 1 0 3z' />
              </svg>
              <p className='text-[15px]'>{t('parking')}</p>
            </div>
            <div className='flex items-center justify-center'>{isOpenParking ? <ExpandLess /> : <ExpandMore />}</div>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isOpenParking ? 'max-h-[150px]' : 'max-h-0'}`}>
            <Link to='/manager/list-parking'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ListParkingPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[15px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 15 15'>
                    <path
                      fill='currentColor'
                      d='M10.5 10.14a3.53 3.53 0 0 1-2.29.66h-1.9V14h-1.9V5h3.92a3.2 3.2 0 0 1 2.16.69a2.69 2.69 0 0 1 .81 2.15a2.76 2.76 0 0 1-.8 2.3M9 6.9a1.56 1.56 0 0 0-1-.3H6.31v2.65H8a1.48 1.48 0 0 0 1-.32a1.3 1.3 0 0 0 .36-1A1.23 1.23 0 0 0 9 6.9m5.41-2.69a.5.5 0 0 0-.24-.66L7.5.45L.79 3.55a.501.501 0 1 0 .42.91L7.5 1.55l6.29 2.9a.5.5 0 0 0 .66-.24z'
                    />
                  </svg>
                  <p className='text-[15px]'>{t('parking_list')}</p>
                </div>
              </div>
            </Link>
            <Link to='/manager/request-parking'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 mt-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === RequestParkingPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[13px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M13 7h-3a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0v-2h2a3 3 0 0 0 3-3v-1a3 3 0 0 0-3-3m1 4a1 1 0 0 1-1 1h-2V9h2a1 1 0 0 1 1 1Zm-2-9a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8'
                    />
                  </svg>
                  <p className='text-[15px]'>{t('parking_request')}</p>
                </div>
              </div>
            </Link>
            <Link to='/manager/unpaid-parking'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ParkingUnpaidPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[17px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 0 16 16'>
                    <path
                      fill='currentColor'
                      fillRule='evenodd'
                      d='M5 1a.75.75 0 0 1 .75.75V3h5V1.75a.75.75 0 0 1 1.5 0V3H14a1 1 0 0 1 1 1v4.25a.75.75 0 0 1-1.5 0V7.5h-11v6h5.75a.75.75 0 0 1 0 1.5H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.25V1.75A.75.75 0 0 1 5 1M2.5 6h11V4.5h-11zm8.78 4.22a.75.75 0 1 0-1.06 1.06L11.94 13l-1.72 1.72a.75.75 0 1 0 1.06 1.06L13 14.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L14.06 13l1.72-1.72a.75.75 0 1 0-1.06-1.06L13 11.94z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <p className='text-[15px]'>{t('unpaid_parking')}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Incident */}
          <div
            className={`flex justify-between px-2 ml-5 mr-2 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ListIncidentPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
            onClick={handleClickIncident}
          >
            <div className='flex justify-center items-center gap-x-[13px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='29' height='29' viewBox='0 0 32 32' className='ml-2'>
                <path
                  fill='currentColor'
                  d='m21.018 26.722l.998 1.732l2.978-1.722V30h1.997v-3.268l3.01 1.74L31 26.74L27.99 25l3-1.735l-.998-1.733l-3.001 1.736V20h-1.997v3.267l-2.996-1.732L21 23.268L23.995 25zM16 23a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m-1-11h2v9h-2z'
                />
                <path
                  fill='currentColor'
                  d='M18 30H3a1 1 0 0 1-.887-1.461l13-25c.172-.331.53-.539.887-.539s.715.208.887.539l6.76 13l-1.774.922L16 6.168L4.647 28H18z'
                />
              </svg>
              <p className='text-[15px]'>{t('incident')}</p>
            </div>
            <div className='flex items-center justify-center'>{isOpenIncident ? <ExpandLess /> : <ExpandMore />}</div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${isOpenIncident ? 'max-h-[100px]' : 'max-h-0'}`}
          >
            <Link to='/manager/list-incident'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ListIncidentPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[15px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M8 17q.425 0 .713-.288T9 16t-.288-.712T8 15t-.712.288T7 16t.288.713T8 17m0-4q.425 0 .713-.288T9 12t-.288-.712T8 11t-.712.288T7 12t.288.713T8 13m0-4q.425 0 .713-.288T9 8t-.288-.712T8 7t-.712.288T7 8t.288.713T8 9m4 8h4q.425 0 .713-.288T17 16t-.288-.712T16 15h-4q-.425 0-.712.288T11 16t.288.713T12 17m0-4h4q.425 0 .713-.288T17 12t-.288-.712T16 11h-4q-.425 0-.712.288T11 12t.288.713T12 13m0-4h4q.425 0 .713-.288T17 8t-.288-.712T16 7h-4q-.425 0-.712.288T11 8t.288.713T12 9M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zM5 5v14z'
                    />
                  </svg>
                  <p className='text-[15px]'>{t('incident_list')}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Notification */}
          <div
            className={`flex justify-between px-2 ml-5 mr-2 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === HistoryNotificationPath || path === AddNotificationPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
            onClick={handleClickNotification}
          >
            <div className='flex justify-center items-center gap-x-[13px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' className='ml-2'>
                <path
                  fill='currentColor'
                  d='M11.943 1.25c-2.309 0-4.118 0-5.53.19c-1.444.194-2.584.6-3.479 1.494c-.895.895-1.3 2.035-1.494 3.48c-.19 1.411-.19 3.22-.19 5.529v.114c0 2.309 0 4.118.19 5.53c.194 1.444.6 2.584 1.494 3.479c.895.895 2.035 1.3 3.48 1.494c1.411.19 3.22.19 5.529.19h.114c2.309 0 4.118 0 5.53-.19c1.444-.194 2.584-.6 3.479-1.494c.895-.895 1.3-2.035 1.494-3.48c.19-1.411.19-3.22.19-5.529V10.5a.75.75 0 0 0-1.5 0V12c0 2.378-.002 4.086-.176 5.386c-.172 1.279-.5 2.05-1.069 2.62c-.57.569-1.34.896-2.619 1.068c-1.3.174-3.008.176-5.386.176s-4.086-.002-5.386-.176c-1.279-.172-2.05-.5-2.62-1.069c-.569-.57-.896-1.34-1.068-2.619c-.174-1.3-.176-3.008-.176-5.386s.002-4.086.176-5.386c.172-1.279.5-2.05 1.069-2.62c.57-.569 1.34-.896 2.619-1.068c1.3-.174 3.008-.176 5.386-.176h1.5a.75.75 0 0 0 0-1.5z'
                />
                <path
                  fill='currentColor'
                  fillRule='evenodd'
                  d='M19 1.25a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5M16.75 5a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0'
                  clipRule='evenodd'
                />
                <path
                  fill='currentColor'
                  d='M6.25 14a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75M7 16.75a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5z'
                />
              </svg>
              <p className='text-[15px]'>{t('notification')}</p>
            </div>
            <div className='flex items-center justify-center'>
              {isOpenNotification ? <ExpandLess /> : <ExpandMore />}
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${isOpenNotification ? 'max-h-[150px]' : 'max-h-0'}`}
          >
            <Link to='/manager/history-notification'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === HistoryNotificationPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[15px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24'>
                    <g
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='1.5'
                      color='currentColor'
                    >
                      <path d='M17 2v2m-5-2v2M7 2v2m-3.5 6c0-3.3 0-4.95 1.025-5.975S7.2 3 10.5 3h3c3.3 0 4.95 0 5.975 1.025S20.5 6.7 20.5 10v5c0 3.3 0 4.95-1.025 5.975S16.8 22 13.5 22h-3c-3.3 0-4.95 0-5.975-1.025S3.5 18.3 3.5 15zm10 6H17m-3.5-7H17' />
                      <path d='M7 10s.5 0 1 1c0 0 1.588-2.5 3-3m-4 9s.5 0 1 1c0 0 1.588-2.5 3-3' />
                    </g>
                  </svg>
                  <p className='text-[15px]'>{t('notification_history')}</p>
                </div>
              </div>
            </Link>
            <Link to='/manager/add-notification'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mt-1 mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === AddNotificationPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[15px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M12 22q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22m6-9v-3h-3V8h3V5h2v3h3v2h-3v3zM4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2V2h3v2.2q.35.1.688.213t.637.287q-.375.35-.675.763t-.525.887q-.375-.175-.788-.262T12 6q-1.65 0-2.825 1.175T8 10v7h8v-2.8q.45.275.95.45t1.05.275V17h2v2z'
                    />
                  </svg>
                  <p className='text-[15px]'>{t('add_notification')}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Transaction History */}
          <div
            className={`flex justify-between px-2 pl-4 ml-5 mr-2 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === PaymentHistoryPath || path === BookingHistoryPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
            onClick={handleClickTransactionHistory}
          >
            <div className='flex justify-center items-center gap-x-[10px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 48 48'>
                <g fill='none' stroke='currentColor' strokeLinejoin='round' strokeWidth='4'>
                  <rect width='30' height='36' x='9' y='8' rx='2' />
                  <path strokeLinecap='round' d='M18 4v6m12-6v6m-14 9h16m-16 8h12m-12 8h8' />
                </g>
              </svg>
              <p className='text-[15px]'>{t('transaction_history')}</p>
            </div>
            <div className='flex items-center justify-center'>
              {isTransactionHistory ? <ExpandLess /> : <ExpandMore />}
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${isTransactionHistory ? 'max-h-[150px]' : 'max-h-0'}`}
          >
            <Link to='/manager/payment-history'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === PaymentHistoryPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[15px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M15.75 14.5a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5zM2 8.25A3.25 3.25 0 0 1 5.25 5h13.5A3.25 3.25 0 0 1 22 8.25v7.5A3.25 3.25 0 0 1 18.75 19H5.25A3.25 3.25 0 0 1 2 15.75zM20.5 9.5V8.25a1.75 1.75 0 0 0-1.75-1.75H5.25A1.75 1.75 0 0 0 3.5 8.25V9.5zM3.5 11v4.75c0 .966.784 1.75 1.75 1.75h13.5a1.75 1.75 0 0 0 1.75-1.75V11z'
                    />
                  </svg>
                  <p className='text-[15px]'>{t('payment_history')}</p>
                </div>
              </div>
            </Link>
            <Link to='/manager/booking-history'>
              <div
                className={`flex justify-between px-4 mr-2 ml-16 h-[45px] mt-1 mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === BookingHistoryPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[17px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 2048 2048'>
                    <path
                      fill='currentColor'
                      d='M896 512v128H512V512zM512 896V768h384v128zm0 256v-128h256v128zM384 512v128H256V512zm0 256v128H256V768zm-128 384v-128h128v128zM128 128v1792h640v128H0V0h1115l549 549v219h-128V640h-512V128zm1024 91v293h293zm640 805h256v1024H896V1024h256V896h128v128h384V896h128zm128 896v-512h-896v512zm0-640v-128h-896v128z'
                    />
                  </svg>
                  <p className='text-[15px]'>{t('booking_history')}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Feedback */}
          <div
            className={`flex justify-between px-2 pl-4 ml-5 mr-2 h-[45px] mb-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === FeedbackPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
            onClick={handleClickFeedback}
          >
            <div className='flex justify-center items-center gap-x-[11px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='29' height='29' viewBox='0 0 16 16'>
                <g fill='currentColor'>
                  <path d='m4.5 1l-.5.5v1.527a4.6 4.6 0 0 1 1 0V2h9v5h-1.707L11 8.293V7H8.973a4.6 4.6 0 0 1 0 1H10v1.5l.854.354L12.707 8H14.5l.5-.5v-6l-.5-.5z' />
                  <path
                    fillRule='evenodd'
                    d='M6.417 10.429a3.5 3.5 0 1 0-3.834 0A4.5 4.5 0 0 0 0 14.5v.5h1v-.5a3.502 3.502 0 0 1 7 0v.5h1v-.5a4.5 4.5 0 0 0-2.583-4.071M4.5 10a2.5 2.5 0 1 1 0-5a2.5 2.5 0 0 1 0 5'
                    clipRule='evenodd'
                  />
                </g>
              </svg>
              <p className='text-[15px]'>{t('feedback')}</p>
            </div>
            <div className='flex items-center justify-center'>{isOpenFeedback ? <ExpandLess /> : <ExpandMore />}</div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${isOpenFeedback ? 'max-h-[100px]' : 'max-h-0'}`}
          >
            <Link to='/manager/feedback'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-10 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === FeedbackPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[15px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M8 17q.425 0 .713-.288T9 16t-.288-.712T8 15t-.712.288T7 16t.288.713T8 17m0-4q.425 0 .713-.288T9 12t-.288-.712T8 11t-.712.288T7 12t.288.713T8 13m0-4q.425 0 .713-.288T9 8t-.288-.712T8 7t-.712.288T7 8t.288.713T8 9m4 8h4q.425 0 .713-.288T17 16t-.288-.712T16 15h-4q-.425 0-.712.288T11 16t.288.713T12 17m0-4h4q.425 0 .713-.288T17 12t-.288-.712T16 11h-4q-.425 0-.712.288T11 12t.288.713T12 13m0-4h4q.425 0 .713-.288T17 8t-.288-.712T16 7h-4q-.425 0-.712.288T11 8t.288.713T12 9M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zM5 5v14z'
                    />
                  </svg>
                  <p className='text-[15px]'>{t('feedback_history')}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
