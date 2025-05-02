import { useState } from 'react'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'
import '../SideBar.css'

export default function SideBarAdminActive() {
  const location = useLocation()
  const path = location.pathname

  const DashboardPath = '/admin/dashboard'
  const ListUserPath = '/admin/list-user'
  const AddUserPath = '/admin/add-user'
  const ListServicePath = '/admin/list-service'
  const AddServicePath = '/admin/add-service'
  const ElectricityPath = '/admin/setting-fee-electricity'
  const WaterPath = '/admin/setting-fee-water'
  const ParkingPath = '/admin/setting-fee-parking'
  const HistoryNotificationPath = '/admin/history-notification'
  const AddNotificationPath = '/admin/add-notification'
  const AddApartmentPath = '/admin/add-apartment'
  const ListApartmentPath = '/admin/list-apartment'

  // const [isOpenDashboard, SetIsOpenDashboard] = useState(true)

  const [isOpenUser, setIsOpenUser] = useState(false)
  const [isOpenService, setIsOpenService] = useState(false)
  const [isOpenFee, setIsOpenFee] = useState(false)
  const [isOpenNotification, setIsOpenNotification] = useState(false)
  const [isOpenApartment, setIsOpenApartment] = useState(false)

  // const handleClickDashboard = () => {
  //   SetIsOpenDashboard(!isOpenDashboard)
  // }
  const handleClickUser = () => {
    setIsOpenUser(!isOpenUser)
  }
  const handleClickService = () => {
    setIsOpenService(!isOpenService)
  }
  const handleClickFee = () => {
    setIsOpenFee(!isOpenFee)
  }
  const handleClickNotification = () => {
    setIsOpenNotification(!isOpenNotification)
  }
  const handleClickApartment = () => {
    setIsOpenApartment(!isOpenApartment)
  }

  return (
    <div className='flex flex-col items-center bg-blue-50 mb-10 w-full h-screen border-r-2 border-[#eaeaea] text-gray-700 overflow-hidden'>
      <Link to='/admin/dashboard'>
        <div className='flex items-center gap-3 group mt-2 px-4 py-2 transition-all duration-300 hover:bg-blue-100 rounded-lg mb-3'>
          <div className='relative w-12 h-12'>
            <div className='absolute inset-0 bg-blue-500 rounded-lg rotate-45 group-hover:rotate-[135deg] transition-all duration-700 ease-in-out'></div>
            <div className='absolute inset-0 bg-blue-500 rounded-lg -rotate-45 group-hover:rotate-0 transition-all duration-700 ease-in-out'></div>
            <div className='absolute inset-0 flex items-center justify-center'>
              <img
                src='/public/imgs/logo/logo-mini.png'
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
              Live Comfortably, Manage Smartly
            </span>
          </div>
        </div>
      </Link>

      <div className='w-full font-semibold overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent'>
        {/* Dashboard */}
        <div className='flex items-center justify-between gap-[10px] h-[45px] px-5'>
          <p className='text-[13px] text-blue-600 mt-2 mb-2'>HOMEPAGE</p>
          <div className='w-[70%] h-[1px] bg-blue-500'></div>
        </div>
        <Link to='/admin/dashboard'>
          <div
            className={`flex justify-between px-4 ml-5 mr-2 h-[45px] rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === DashboardPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
          >
            <div className='flex justify-center items-center gap-x-[17px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5'>
                  <path d='M6.133 21C4.955 21 4 20.02 4 18.81v-8.802c0-.665.295-1.295.8-1.71l5.867-4.818a2.09 2.09 0 0 1 2.666 0l5.866 4.818c.506.415.801 1.045.801 1.71v8.802c0 1.21-.955 2.19-2.133 2.19z' />
                  <path d='M9.5 21v-5.5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2V21' />
                </g>
              </svg>
              <p className='text-[15px]'>Dashboard</p>
            </div>
          </div>
        </Link>

        <div className='flex items-center justify-between gap-[10px] h-[45px] px-6'>
          <p className='text-[13px] text-blue-600 mt-2 mb-2'>FEATURES</p>
          <div className='w-[70%] h-[1px] bg-blue-500'></div>
        </div>

        <div className='w-full'>
          {/* User */}
          <div
            className={`flex justify-between px-2 ml-5 mr-2 h-[45px] rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ListUserPath || path === AddUserPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
            onClick={handleClickUser}
          >
            <div className='flex justify-center items-center gap-x-[10px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' className='ml-2'>
                <g fill='none' stroke='currentColor' strokeWidth='1.5'>
                  <circle cx='12' cy='6' r='4' />
                  <path d='M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z' />
                </g>
              </svg>
              <p className='text-[15px]'>Users</p>
            </div>
            <div className='flex items-center justify-center'>{isOpenUser ? <ExpandLess /> : <ExpandMore />}</div>
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${isOpenUser ? 'max-h-[100px]' : 'max-h-0'}`}>
            <Link to='/admin/list-user'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 mt-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ListUserPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[15px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 0 250 250'>
                    <path
                      fill='currentColor'
                      d='M152 80a8 8 0 0 1 8-8h88a8 8 0 0 1 0 16h-88a8 8 0 0 1-8-8m96 40h-88a8 8 0 0 0 0 16h88a8 8 0 0 0 0-16m0 48h-64a8 8 0 0 0 0 16h64a8 8 0 0 0 0-16m-96.25 22a8 8 0 0 1-5.76 9.74a7.6 7.6 0 0 1-2 .26a8 8 0 0 1-7.75-6c-6.16-23.94-30.34-42-56.25-42s-50.09 18.05-56.25 42a8 8 0 0 1-15.5-4c5.59-21.71 21.84-39.29 42.46-48a48 48 0 1 1 58.58 0c20.63 8.71 36.88 26.29 42.47 48M80 136a32 32 0 1 0-32-32a32 32 0 0 0 32 32'
                    />
                  </svg>
                  <p className='text-[15px]'>List Users</p>
                </div>
              </div>
            </Link>
            <Link to='/admin/add-user'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mt-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === AddUserPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[15px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <g fill='none' fillRule='evenodd'>
                      <path d='m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z' />
                      <path
                        fill='currentColor'
                        d='M16 14a5 5 0 0 1 5 5v2a1 1 0 1 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 1 1-2 0v-2a5 5 0 0 1 5-5zm4-6a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 1 1 0-2h1V9a1 1 0 0 1 1-1m-8-6a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6'
                      />
                    </g>
                  </svg>
                  <p className='text-[15px]'>Add Users</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Service */}
          <div
            className={`flex justify-between mt-1 px-2 ml-5 mr-2 h-[45px] rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ListServicePath || path === AddServicePath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
            onClick={handleClickService}
          >
            <div className='flex justify-center items-center gap-x-[16px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 2048 2048' className='ml-1'>
                <path
                  fill='currentColor'
                  d='M320 640q66 0 124 25t101 69t69 102t26 124t-25 124t-69 102t-102 69t-124 25t-124-25t-102-68t-69-102T0 960t25-124t68-101t102-69t125-26m0 512q40 0 75-15t61-41t41-61t15-75t-15-75t-41-61t-61-41t-75-15t-75 15t-61 41t-41 61t-15 75t15 75t41 61t61 41t75 15m1532 78q46 30 82 71t62 89t38 101t14 109q0 93-35 174t-96 143t-142 96t-175 35q-93 0-174-35t-143-96t-96-142t-35-175q0-50 10-94q-88-29-160-83t-125-126t-80-158t-29-179q0-119 45-224t124-183t183-123t224-46q18 0 36 1t36 3q-8-35-8-68q0-66 25-124t68-101t102-69t125-26t124 25t101 69t69 102t26 124q0 53-17 102t-48 90t-74 71t-94 45q52 73 78 157t27 175q0 71-17 139t-51 131m-316-910q0 62 37 111q35 15 68 35t63 44q6 1 12 1t12 1q40 0 75-15t61-41t41-61t15-75t-15-75t-41-61t-61-41t-75-15t-75 15t-61 41t-41 61t-15 75M896 960q0 72 22 139t64 124t98 99t126 64q62-109 165-171t229-63q71 0 137 21q27-49 41-103t14-110q0-95-38-181t-108-150l-4-1q-35-29-69-50t-77-39l-1-1q-73-26-151-26q-93 0-174 35t-142 96t-96 142t-36 175m704 960q66 0 124-25t101-68t69-102t26-125q0-70-26-128t-71-101t-105-67t-128-24q-64 0-120 26t-99 71t-66 102t-25 121q0 66 25 124t68 102t102 69t125 25'
                />
              </svg>
              <p className='text-[15px]'>Services</p>
            </div>
            <div className='flex items-center justify-center'>{isOpenService ? <ExpandLess /> : <ExpandMore />}</div>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isOpenService ? 'max-h-[100px]' : 'max-h-0'}`}>
            <Link to='/admin/list-service'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 mt-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ListServicePath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[15px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      fillRule='evenodd'
                      d='M20 4H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M4 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zm2 5h2v2H6zm5 0a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2zm-3 4H6v2h2zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1m-2 3H6v2h2zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1'
                      clipRule='evenodd'
                    />
                  </svg>
                  <p className='text-[15px]'>List Services</p>
                </div>
              </div>
            </Link>
            <Link to='/admin/add-service'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mt-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === AddServicePath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[15px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M11 9h4v2h-4v4H9v-4H5V9h4V5h2zm-1 11a10 10 0 1 1 0-20a10 10 0 0 1 0 20m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16'
                    />
                  </svg>
                  <p className='text-[15px]'>Add Service</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Fees */}
          <div
            className={`flex justify-between mt-1 px-2 ml-5 mr-2 h-[45px] rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ElectricityPath || path === WaterPath || path === ParkingPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
            onClick={handleClickFee}
          >
            <div className='flex justify-center items-center gap-[11px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='35' height='35' viewBox='0 0 24 24' className='ml-1'>
                <path
                  fill='currentColor'
                  d='M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19zm0-1h14.769q.23 0 .423-.192t.192-.424V6.616q0-.231-.192-.424T19.385 6H4.615q-.23 0-.423.192T4 6.616v10.769q0 .23.192.423t.423.192M4 18V6zm6.5-3.5H7q-.213 0-.357.143T6.5 15t.143.357T7 15.5h1.5v.5q0 .214.143.357T9 16.5t.357-.143T9.5 16v-.5h1.23q.33 0 .55-.22t.22-.55v-2.46q0-.33-.22-.55t-.55-.22H7.5v-2H11q.214 0 .357-.143T11.5 9t-.143-.357T11 8.5H9.5V8q0-.213-.143-.357T9 7.5t-.357.143T8.5 8v.5H7.27q-.33 0-.55.22t-.22.55v2.46q0 .33.22.55t.55.22h3.23zm5.637 1.344l1.054-1.053q.105-.106.052-.227q-.052-.122-.19-.122h-2.107q-.136 0-.19.122q-.052.12.054.227l1.053 1.053q.056.056.137.056t.137-.056m-1.19-6.036h2.107q.137 0 .19-.121t-.054-.227l-1.054-1.054Q16.082 8.35 16 8.35t-.136.056l-1.055 1.053q-.105.106-.052.227t.19.122'
                />
              </svg>
              <p className='text-[15px]'>Fees</p>
            </div>
            <div className='flex items-center justify-center'>{isOpenFee ? <ExpandLess /> : <ExpandMore />}</div>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isOpenFee ? 'max-h-[150px]' : 'max-h-0'}`}>
            <Link to='/admin/setting-fee-electricity'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 mt-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ElectricityPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[6px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='34' height='32' viewBox='0 0 24 20'>
                    <path
                      fill='currentColor'
                      fillRule='evenodd'
                      d='M15 8.5h-3.813l2.273-5.303A.5.5 0 0 0 13 2.5H8a.5.5 0 0 0-.46.303l-3 7A.5.5 0 0 0 5 10.5h2.474l-2.938 7.314c-.2.497.417.918.807.55l5.024-4.743l4.958-4.241A.5.5 0 0 0 15 8.5m-4.571 1h3.217l-3.948 3.378l-3.385 3.195l2.365-5.887a.5.5 0 0 0-.464-.686H5.758l2.572-6h3.912L9.969 8.803a.5.5 0 0 0 .46.697'
                      clipRule='evenodd'
                    />
                  </svg>
                  <p className='text-[15px]'>Fee Electricity</p>
                </div>
              </div>
            </Link>
            <Link to='/admin/setting-fee-water'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 mt-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === WaterPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[15px]'>
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
                  <p className='text-[15px]'>Fee Water</p>
                </div>
              </div>
            </Link>
            <Link to='/admin/setting-fee-parking'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mt-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ParkingPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[15px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='27' height='27' viewBox='0 0 24 24'>
                    <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5'>
                      <path d='M10.5 15v-2.4m0 0h2.276c2.299 0 2.299-3.6 0-3.6H10.5z' />
                      <path d='M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0' />
                    </g>
                  </svg>
                  <p className='text-[15px]'>Fee Parking</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Apartment */}
          <div
            className={`flex justify-between mt-1 px-2 ml-5 mr-2 h-[45px] rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ListApartmentPath || path === AddApartmentPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
            onClick={handleClickApartment}
          >
            <div className='flex justify-center items-center gap-[11px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='35' height='35' viewBox='0 0 24 24' className='ml-1'>
                <path
                  fill='currentColor'
                  d='M4.539 20.154q-.441 0-.74-.3t-.299-.738V8.192q0-.44.299-.739q.299-.3.74-.3H7.5v-2.96q0-.441.299-.74q.299-.3.74-.3h6.923q.44 0 .739.3q.299.299.299.74v6.96h2.962q.44 0 .739.3q.299.299.299.74v6.923q0 .44-.299.739t-.74.299H13.5v-4h-3v4zm-.039-1h3v-3h-3zm0-4h3v-3h-3zm0-4h3v-3h-3zm4 4h3v-3h-3zm0-4h3v-3h-3zm0-4h3v-3h-3zm4 8h3v-3h-3zm0-4h3v-3h-3zm0-4h3v-3h-3zm4 12h3v-3h-3zm0-4h3v-3h-3z'
                />
              </svg>
              <p className='text-[15px]'>Apartments</p>
            </div>
            <div className='flex items-center justify-center'>{isOpenApartment ? <ExpandLess /> : <ExpandMore />}</div>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${isOpenApartment ? 'max-h-[150px]' : 'max-h-0'}`}
          >
            <Link to='/admin/list-apartment'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 mt-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === ListApartmentPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[11px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='27' height='27' viewBox='0 0 1024 1024'>
                    <path
                      fill='currentColor'
                      d='M908 640H804V488c0-4.4-3.6-8-8-8H548v-96h108c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16H368c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h108v96H228c-4.4 0-8 3.6-8 8v152H116c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h288c8.8 0 16-7.2 16-16V656c0-8.8-7.2-16-16-16H292v-88h440v88H620c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h288c8.8 0 16-7.2 16-16V656c0-8.8-7.2-16-16-16zm-564 76v168H176V716zm84-408V140h168v168zm420 576H680V716h168z'
                    />
                  </svg>
                  <p className='text-[15px]'>List Apartments</p>
                </div>
              </div>
            </Link>
            <Link to='/admin/add-apartment'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mt-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === AddApartmentPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[15px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 2048 2048'>
                    <path
                      fill='currentColor'
                      d='M1024 128v896h896v1024H0V128zM896 1920v-768H128v768zm0-896V256H128v768zm896 128h-768v768h768zm-128-768h384v128h-384v384h-128V512h-384V384h384V0h128z'
                    />
                  </svg>
                  <p className='text-[15px]'>Add Apartment</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Notification */}
          <div
            className={`flex justify-between mt-1 px-2 ml-5 mr-2 h-[45px] rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === HistoryNotificationPath || path === AddNotificationPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
            onClick={handleClickNotification}
          >
            <div className='flex justify-center items-center gap-[15px]'>
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
              <p className='text-[15px]'>Notifications</p>
            </div>
            <div className='flex items-center justify-center'>
              {isOpenNotification ? <ExpandLess /> : <ExpandMore />}
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${isOpenNotification ? 'max-h-[150px]' : 'max-h-0'}`}
          >
            <Link to='/admin/history-notification'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mb-1 mt-1 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === HistoryNotificationPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[15px]'>
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
                  <p className='text-[15px]'>History Notification</p>
                </div>
              </div>
            </Link>
            <Link to='/admin/add-notification'>
              <div
                className={`flex justify-between px-4 mr-2 ml-15 h-[45px] mt-1 mb-10 rounded-xl cursor-pointer hover:bg-blue-100 ripple ${path === AddNotificationPath ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100 text-blue-900'}`}
              >
                <div className='flex items-center gap-[15px]'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M12 22q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22m6-9v-3h-3V8h3V5h2v3h3v2h-3v3zM4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2V2h3v2.2q.35.1.688.213t.637.287q-.375.35-.675.763t-.525.887q-.375-.175-.788-.262T12 6q-1.65 0-2.825 1.175T8 10v7h8v-2.8q.45.275.95.45t1.05.275V17h2v2z'
                    />
                  </svg>
                  <p className='text-[15px]'>Add Notification</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
