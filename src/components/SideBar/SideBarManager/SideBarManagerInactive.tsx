import { Link, useLocation } from 'react-router-dom'
import '../SideBar.css'

export default function SideBarManagerInactive() {
  const location = useLocation()
  const path = location.pathname

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

  return (
    <div className='flex flex-col items-center bg-[#fff] mb-10 w-full h-screen border-r-2 border-[#eaeaea] text-[#4d595e]'>
      <Link to='/manager/dashboard'>
        <div className='w-20 h-20 ml-2'>
          <img src='/public/imgs/logo/logo-mini.png' className='w-full h-full object-cover' />
        </div>
      </Link>

      <div className='w-full font-semibold flex flex-col items-center'>
        {/* Dashboard */}
        <p className='text-[13px] text-gray-400 mt-2 mb-2'>HOMEPAGE</p>
        <Link to='/manager/dashboard'>
          <div
            className={`flex justify-between px-[13px] h-[80px] rounded-xl cursor-pointer hover:bg-[#ebf2f5] ripple ${path === DashboardPath ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'}`}
          >
            <div className='flex flex-col justify-center items-center gap-[2px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5'>
                  <path d='M6.133 21C4.955 21 4 20.02 4 18.81v-8.802c0-.665.295-1.295.8-1.71l5.867-4.818a2.09 2.09 0 0 1 2.666 0l5.866 4.818c.506.415.801 1.045.801 1.71v8.802c0 1.21-.955 2.19-2.133 2.19z' />
                  <path d='M9.5 21v-5.5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2V21' />
                </g>
              </svg>
              <p className='text-[13px]'>Dashboard</p>
            </div>
          </div>
        </Link>

        <p className='text-[13px] text-gray-400 mt-3 mb-2'>FEATURES</p>
        <div className='flex flex-col items-center'>
          {/* User */}
          <div className='relative group'>
            {/* Nút bấm */}
            <div
              className={`flex justify-between px-[29px] h-[80px] rounded-xl cursor-pointer hover:bg-[#ebf2f5] ripple ${path === ListUserPath ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'}`}
            >
              <div className='flex flex-col justify-center items-center gap-[2px]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='30'
                  height='30'
                  viewBox='0 0 30 30'
                  style={{ marginLeft: '5px' }}
                >
                  <g fill='none' stroke='currentColor' strokeWidth='1.5'>
                    <circle cx='12' cy='6' r='4' />
                    <path d='M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z' />
                  </g>
                </svg>
                <p className='text-[13px]'>Users</p>
              </div>
            </div>

            {/* Hover Menu */}
            <div className='hover-menu'>
              <ul>
                <Link to='/manager/list-resident'>
                  <div
                    className={`flex justify-between h-[40px] pl-[20px] pr-[20px] text-[13px] rounded-2xl hover:bg-[#ebf2f5] ripple ${path === ListUserPath ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'}`}
                  >
                    <div className='flex items-center gap-[10px]'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 0 250 250'>
                        <path
                          fill='currentColor'
                          d='M152 80a8 8 0 0 1 8-8h88a8 8 0 0 1 0 16h-88a8 8 0 0 1-8-8m96 40h-88a8 8 0 0 0 0 16h88a8 8 0 0 0 0-16m0 48h-64a8 8 0 0 0 0 16h64a8 8 0 0 0 0-16m-96.25 22a8 8 0 0 1-5.76 9.74a7.6 7.6 0 0 1-2 .26a8 8 0 0 1-7.75-6c-6.16-23.94-30.34-42-56.25-42s-50.09 18.05-56.25 42a8 8 0 0 1-15.5-4c5.59-21.71 21.84-39.29 42.46-48a48 48 0 1 1 58.58 0c20.63 8.71 36.88 26.29 42.47 48M80 136a32 32 0 1 0-32-32a32 32 0 0 0 32 32'
                        />
                      </svg>
                      <li className='flex items-center h-[30px] pl-[10px]'>List Residents</li>
                    </div>
                  </div>
                </Link>
              </ul>
            </div>
          </div>

          {/* Electricity */}
          <div className='relative group'>
            {/* Nút bấm */}
            <div
              className={`flex justify-between px-[23px] py-2 mt-1 h-[80px] rounded-xl cursor-pointer hover:bg-[#ebf2f5] ripple ${path === ElectricMeterPath || path === ElectricicReadingPath || path === ElectricUnpaidPath ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'}`}
            >
              <div className='flex flex-col justify-center items-center gap-[2px]'>
                <svg xmlns='http://www.w3.org/2000/svg' width='34' height='32' viewBox='0 0 24 20' className='ml-2'>
                  <path
                    fill='currentColor'
                    fillRule='evenodd'
                    d='M15 8.5h-3.813l2.273-5.303A.5.5 0 0 0 13 2.5H8a.5.5 0 0 0-.46.303l-3 7A.5.5 0 0 0 5 10.5h2.474l-2.938 7.314c-.2.497.417.918.807.55l5.024-4.743l4.958-4.241A.5.5 0 0 0 15 8.5m-4.571 1h3.217l-3.948 3.378l-3.385 3.195l2.365-5.887a.5.5 0 0 0-.464-.686H5.758l2.572-6h3.912L9.969 8.803a.5.5 0 0 0 .46.697'
                    clipRule='evenodd'
                  />
                </svg>
                <p className='text-[13px]'>Electric</p>
              </div>
            </div>

            {/* Hover Menu */}
            <div className='hover-menu'>
              <ul>
                <Link to='/manager/add-electricity-meter'>
                  <div
                    className={`flex justify-between h-[40px] pl-[20px] pr-[20px] text-[13px] mb-1 rounded-2xl hover:bg-[#ebf2f5] ripple ${path === ElectricMeterPath ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'}`}
                  >
                    <div className='flex items-center gap-[6px]'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='29' height='29' viewBox='0 0 24 24'>
                        <path
                          fill='currentColor'
                          d='M9 21.95v-2.5q-2.65-.925-4.325-3.237T3 10.95q0-1.875.713-3.512t1.924-2.85t2.85-1.925t3.488-.713t3.5.713t2.875 1.925t1.938 2.85T21 10.95q0 2.95-1.687 5.238T15 19.425v2.525h-2V19.9q-.25.05-.5.05h-.525q-.25 0-.488-.012T11 19.9v2.05zM12 18q2.9 0 4.95-2.05T19 11t-2.05-4.95T12 4T7.05 6.05T5 11t2.05 4.95T12 18M8 9h8V7H8zm3.25 8l3-3L13 12.75l1.25-1.25l-1.5-1.5l-3 3L11 14.25L9.75 15.5zm.75-6'
                        />
                      </svg>
                      <li className='flex items-center h-[30px] pl-[10px]'>Electric Meter</li>
                    </div>
                  </div>
                </Link>
                <Link to='/manager/add-electricity-reading'>
                  <div
                    className={`flex justify-between h-[40px] pl-[20px] pr-[20px] text-[13px] mb-1 rounded-2xl hover:bg-[#ebf2f5] ripple ${path === ElectricicReadingPath ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'}`}
                  >
                    <div className='flex items-center gap-[10px]'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 24 24'>
                        <path
                          fill='currentColor'
                          d='M15 9h1V7.5h4V9h1c.55 0 1 .45 1 1v11c0 .55-.45 1-1 1h-6c-.55 0-1-.45-1-1V10c0-.55.45-1 1-1m1 2v3h4v-3zm-4-5.31l-5 4.5V18h5v2H5v-8H2l10-9l2.78 2.5H14v1.67l-.24.1z'
                        />
                      </svg>
                      <li className='flex items-center h-[30px] pl-[8px] '>Electric Reading</li>
                    </div>
                  </div>
                </Link>
                <Link to='/manager/unpaid-electricity'>
                  <div
                    className={`flex justify-between h-[40px] pl-[20px] pr-[20px] text-[13px] rounded-2xl hover:bg-[#ebf2f5] ripple ${path === ElectricUnpaidPath ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'}`}
                  >
                    <div className='flex items-center gap-[12px]'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 16 16'>
                        <path
                          fill='currentColor'
                          fillRule='evenodd'
                          d='M5 1a.75.75 0 0 1 .75.75V3h5V1.75a.75.75 0 0 1 1.5 0V3H14a1 1 0 0 1 1 1v4.25a.75.75 0 0 1-1.5 0V7.5h-11v6h5.75a.75.75 0 0 1 0 1.5H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.25V1.75A.75.75 0 0 1 5 1M2.5 6h11V4.5h-11zm8.78 4.22a.75.75 0 1 0-1.06 1.06L11.94 13l-1.72 1.72a.75.75 0 1 0 1.06 1.06L13 14.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L14.06 13l1.72-1.72a.75.75 0 1 0-1.06-1.06L13 11.94z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <li className='flex items-center h-[30px] pl-[10px] '>Unpiad Electric</li>
                    </div>
                  </div>
                </Link>
              </ul>
            </div>
          </div>

          {/* Water */}
          <div className='relative group'>
            {/* Nút bấm */}
            <div
              className={`flex justify-between px-[29px] py-2 mt-1 h-[80px] rounded-xl cursor-pointer hover:bg-[#ebf2f5] ripple ${path === WaterMeterPath || path === WaterReadingPath || path === WaterUnpaidPath ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'}`}
            >
              <div className='flex flex-col justify-center items-center gap-[2px]'>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 512 512'>
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
                <p className='text-[13px]'>Water</p>
              </div>
            </div>

            {/* Hover Menu */}
            <div className='hover-menu'>
              <ul>
                <Link to='/manager/add-water-meter'>
                  <div
                    className={`flex justify-between h-[40px] pl-[20px] pr-[20px] text-[13px] mb-1 rounded-2xl hover:bg-[#ebf2f5] ripple ${path === WaterMeterPath ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'}`}
                  >
                    <div className='flex items-center gap-[6px]'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 24 24'>
                        <path
                          fill='currentColor'
                          d='M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 2a8 8 0 0 1 8 8c0 2.4-1 4.5-2.7 6c-1.4-1.3-3.3-2-5.3-2s-3.8.7-5.3 2C5 16.5 4 14.4 4 12a8 8 0 0 1 8-8m2 1.89c-.38.01-.74.26-.9.65l-1.29 3.23l-.1.23c-.71.13-1.3.6-1.57 1.26c-.41 1.03.09 2.19 1.12 2.6s2.19-.09 2.6-1.12c.26-.66.14-1.42-.29-1.98l.1-.26l1.29-3.21l.01-.03c.2-.51-.05-1.09-.56-1.3c-.13-.05-.26-.07-.41-.07M10 6a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1M7 9a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m10 0a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1'
                        />
                      </svg>
                      <li className='flex items-center h-[30px] pl-[10px]'>Water Meter</li>
                    </div>
                  </div>
                </Link>
                <Link to='/manager/add-water-reading'>
                  <div
                    className={`flex justify-between h-[40px] pl-[20px] pr-[20px] text-[13px] mb-1 rounded-2xl hover:bg-[#ebf2f5] ripple ${path === WaterReadingPath ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'}`}
                  >
                    <div className='flex items-center gap-[10px]'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                        <path
                          fill='currentColor'
                          d='M4 22V4h5V2h2v2h2V2h2v2h5v18zm2-2h12V6H6zm2-10h8V8H8zm4 8q1.05 0 1.775-.712t.725-1.738q0-.825-.475-1.412T12 11.75q-1.575 1.8-2.037 2.4t-.463 1.4q0 1.025.725 1.738T12 18m-6 2V6z'
                        />
                      </svg>
                      <li className='flex items-center h-[30px] pl-[8px] '>Water Reading</li>
                    </div>
                  </div>
                </Link>
                <Link to='/manager/unpaid-water'>
                  <div
                    className={`flex justify-between h-[40px] pl-[20px] pr-[20px] text-[13px] rounded-2xl hover:bg-[#ebf2f5] ripple ${path === WaterUnpaidPath ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'}`}
                  >
                    <div className='flex items-center gap-[12px]'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 16 16'>
                        <path
                          fill='currentColor'
                          fillRule='evenodd'
                          d='M5 1a.75.75 0 0 1 .75.75V3h5V1.75a.75.75 0 0 1 1.5 0V3H14a1 1 0 0 1 1 1v4.25a.75.75 0 0 1-1.5 0V7.5h-11v6h5.75a.75.75 0 0 1 0 1.5H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.25V1.75A.75.75 0 0 1 5 1M2.5 6h11V4.5h-11zm8.78 4.22a.75.75 0 1 0-1.06 1.06L11.94 13l-1.72 1.72a.75.75 0 1 0 1.06 1.06L13 14.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L14.06 13l1.72-1.72a.75.75 0 1 0-1.06-1.06L13 11.94z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <li className='flex items-center h-[30px] pl-[10px] '>Unpiad Water</li>
                    </div>
                  </div>
                </Link>
              </ul>
            </div>
          </div>

          {/* Notification */}
          <div className='relative group'>
            {/* Nút bấm */}
            <div
              className={`flex justify-between px-[7px] py-2 mt-1 h-[80px] rounded-xl cursor-pointer hover:bg-[#ebf2f5] ripple ${path === HistoryNotificationPath || path === AddNotificationPath ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'}`}
            >
              <div className='flex flex-col justify-center items-center gap-[2px]'>
                <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'>
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
                <p className='text-[13px]'>Notifications</p>
              </div>
            </div>

            {/* Hover Menu */}
            <div className='hover-menu'>
              <ul>
                <Link to='/manager/history-notification'>
                  <div
                    className={`flex justify-between h-[40px] pl-[20px] pr-[20px] text-[13px] mb-1 rounded-2xl hover:bg-[#ebf2f5] ripple ${path === HistoryNotificationPath ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'}`}
                  >
                    <div className='flex items-center gap-[10px]'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 24 24'>
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
                      <li className='flex items-center h-[30px] pl-[10px]'>History Notify</li>
                    </div>
                  </div>
                </Link>
                <Link to='/manager/add-notification'>
                  <div
                    className={`flex justify-between h-[40px] pl-[20px] pr-[20px] text-[13px] rounded-2xl hover:bg-[#ebf2f5] ripple ${path === AddNotificationPath ? 'bg-[#eaf3fd] text-[#3385f0]' : 'hover:bg-[#ebf2f5]'}`}
                  >
                    <div className='flex items-center gap-[10px]'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 24 24'>
                        <path
                          fill='currentColor'
                          d='M12 22q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22m6-9v-3h-3V8h3V5h2v3h3v2h-3v3zM4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2V2h3v2.2q.35.1.688.213t.637.287q-.375.35-.675.763t-.525.887q-.375-.175-.788-.262T12 6q-1.65 0-2.825 1.175T8 10v7h8v-2.8q.45.275.95.45t1.05.275V17h2v2z'
                        />
                      </svg>
                      <li className='flex items-center h-[30px] pl-[10px]'>Add Notify</li>
                    </div>
                  </div>
                </Link>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
