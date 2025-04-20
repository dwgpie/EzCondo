import { useState } from 'react'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import EditNotificationsTwoToneIcon from '@mui/icons-material/EditNotificationsTwoTone'
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone'
import MarkUnreadChatAltTwoToneIcon from '@mui/icons-material/MarkUnreadChatAltTwoTone'
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone'
import RecentActorsTwoToneIcon from '@mui/icons-material/RecentActorsTwoTone'
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone'
import FitnessCenterTwoToneIcon from '@mui/icons-material/FitnessCenterTwoTone'
import WaterDropTwoToneIcon from '@mui/icons-material/WaterDropTwoTone'
import '../SideBar.css'

export default function SideBarManagerActive() {
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

  const [isOpenUser, setIsOpenUser] = useState(false)
  const [isOpenService, setIsOpenService] = useState(false)
  const [isOpenElectric, setIsOpenElectric] = useState(false)
  const [isOpenWater, setIsOpenWater] = useState(false)
  const [isOpenNotification, setIsOpenNotification] = useState(false)

  const handleClickUser = () => {
    setIsOpenUser(!isOpenUser)
  }
  const handleClickService = () => {
    setIsOpenService(!isOpenService)
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

  return (
    <div className='flex flex-col items-center bg-[#fff] border-r-2 border-[#d1d5dc] text-[#7A8699] h-screen'>
      {' '}
      <Link to='/manager/dashboard'>
        <div className='w-20 h-20'>
          <img src='/public/imgs/logo/lo23-Photoroom.png' className='w-full h-full object-cover' />
        </div>
      </Link>
      <div className='w-full font-semibold'>
        {/* Dashboard */}
        <div className='flex items-center justify-between gap-[10px] h-[50px] pl-[20px] pr-[20px]'>
          <p className='' onClick={handleClickUser}>
            Dashboard
          </p>
          <div className='w-[70%] h-[1px] bg-[#bdbdbd]'></div>
        </div>
        <Link to='/manager/dashboard'>
          <div
            className={`flex justify-between h-[50px] pl-[10px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === DashboardPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
          >
            <div className={`flex items-center gap-[10px] ${path === DashboardPath ? 'text-[#1976d3]' : ''}`}>
              <DashboardTwoToneIcon />
              <p>Dashboard</p>
            </div>
          </div>
        </Link>

        <div className='flex items-center justify-between gap-[10px] h-[50px] pl-[20px] pr-[20px]'>
          <p>Feature</p>
          <div className='w-[70%] h-[1px] bg-[#bdbdbd]'></div>
        </div>

        <div style={{ height: 'calc(100vh - 230px)' }} className='w-full overflow-y-auto custom-scrollbar '>
          {/* User */}
          <div
            className={`flex justify-between items-center h-[50px] pl-[10px] pr-[10px] ml-[10px] mr-[20px]  rounded-xl cursor-pointer hover:bg-[#E5F2FF]`}
            onClick={handleClickUser}
          >
            <div className={`flex items-center gap-[10px] ${path === ListUserPath ? 'text-[#1976d3]' : ''}`}>
              <PersonOutlineTwoToneIcon />
              <p className=''>User</p>
            </div>
            {isOpenUser ? <ExpandLess /> : <ExpandMore />}
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isOpenUser ? 'max-h-[100px]' : 'max-h-0'}`}>
            <Link to='/manager/list-resident'>
              <div
                className={`flex justify-between  h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === ListUserPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === ListUserPath ? 'text-[#1976d3]' : ''}`}>
                  <RecentActorsTwoToneIcon />
                  <p className='pl-4 py-2 '>List Residents</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Service */}
          <div
            className={`flex justify-between items-center  h-[50px] pl-[10px] pr-[10px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF]`}
            onClick={handleClickService}
          >
            <div className={`flex items-center gap-[10px] ${path === '' ? 'text-[#1976d3]' : ''}`}>
              <FitnessCenterTwoToneIcon />
              <p className=''>Service</p>
            </div>
            {isOpenService ? <ExpandLess /> : <ExpandMore />}
          </div>

          {/* Electricity */}
          <div
            className={`flex justify-between items-center h-[50px] pl-[10px] pr-[10px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF]`}
            onClick={handleClickElectric}
          >
            <div
              className={`flex items-center gap-[10px] ${path === ElectricMeterPath || path === ElectricicReadingPath || path === ElectricUnpaidPath ? 'text-[#1976d3]' : ''}`}
            >
              <ElectricBoltIcon />
              <p className=''>Electricity</p>
            </div>
            {isOpenElectric ? <ExpandLess /> : <ExpandMore />}
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${isOpenElectric ? 'max-h-[150px]' : 'max-h-0'}`}
          >
            <Link to='/manager/add-electricity-meter'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === ElectricMeterPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === ElectricMeterPath ? 'text-[#1976d3]' : ''}`}>
                  <ElectricBoltIcon />
                  <p className='pl-4 py-2 '>Electricity Meter</p>
                </div>
              </div>
            </Link>

            <Link to='/manager/add-electricity-reading'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === ElectricicReadingPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div
                  className={`flex items-center gap-[10px] ${path === ElectricicReadingPath ? 'text-[#1976d3]' : ''}`}
                >
                  <ElectricBoltIcon />
                  <p className='pl-4 py-2 '>Electricity Reading</p>
                </div>
              </div>
            </Link>

            <Link to='/manager/unpaid-electricity'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === ElectricUnpaidPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === ElectricUnpaidPath ? 'text-[#1976d3]' : ''}`}>
                  <ElectricBoltIcon />
                  <p className='pl-4 py-2 '>Unpaid Electricity</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Water */}
          <div
            className={`flex justify-between items-center h-[50px] pl-[10px] pr-[10px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF]`}
            onClick={handleClickWater}
          >
            <div
              className={`flex items-center gap-[10px] ${path === WaterMeterPath || path === WaterReadingPath || path === WaterUnpaidPath ? 'text-[#1976d3]' : ''}`}
            >
              <WaterDropTwoToneIcon />
              <p className=''>Water</p>
            </div>
            {isOpenWater ? <ExpandLess /> : <ExpandMore />}
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isOpenWater ? 'max-h-[150px]' : 'max-h-0'}`}>
            <Link to='/manager/add-water-meter'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === WaterMeterPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === WaterMeterPath ? 'text-[#1976d3]' : ''}`}>
                  <WaterDropTwoToneIcon />
                  <p className='pl-4 py-2 '>Water Meter</p>
                </div>
              </div>
            </Link>

            <Link to='/manager/add-water-reading'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === WaterReadingPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === WaterReadingPath ? 'text-[#1976d3]' : ''}`}>
                  <WaterDropTwoToneIcon />
                  <p className='pl-4 py-2 '>Water Reading</p>
                </div>
              </div>
            </Link>

            <Link to='/manager/unpaid-water'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === WaterUnpaidPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === WaterUnpaidPath ? 'text-[#1976d3]' : ''}`}>
                  <WaterDropTwoToneIcon />
                  <p className='pl-4 py-2 '>Unpaid Water</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Notification */}
          <div
            className={`flex justify-between items-center h-[50px] pl-[10px] pr-[10px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF]`}
            onClick={handleClickNotification}
          >
            <div
              className={`flex items-center gap-[10px] ${path === HistoryNotificationPath || path === AddNotificationPath ? 'text-[#1976d3]' : ''}`}
            >
              <MarkUnreadChatAltTwoToneIcon />
              <p className=''>Notification</p>
            </div>
            {isOpenNotification ? <ExpandLess /> : <ExpandMore />}
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${isOpenNotification ? 'max-h-[150px]' : 'max-h-0'}`}
          >
            <Link to='/manager/history-notification'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF]  ${path === HistoryNotificationPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div
                  className={`flex items-center gap-[10px] ${path === HistoryNotificationPath ? 'text-[#1976d3]' : ''}`}
                >
                  <AssignmentTwoToneIcon />
                  <p className='pl-4 py-2 '>History Notification</p>
                </div>
              </div>
            </Link>
            <Link to='/manager/add-notification'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === AddNotificationPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === AddNotificationPath ? 'text-[#1976d3]' : ''}`}>
                  <EditNotificationsTwoToneIcon />
                  <p className='pl-4 py-2 '>Add Notification</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
