import { useState } from 'react'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'
import BlurLinearIcon from '@mui/icons-material/BlurLinear'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import LocalParkingIcon from '@mui/icons-material/LocalParking'
import ApartmentIcon from '@mui/icons-material/Apartment'
import DomainAddIcon from '@mui/icons-material/DomainAdd'
import BusinessIcon from '@mui/icons-material/Business'
import EditNotificationsTwoToneIcon from '@mui/icons-material/EditNotificationsTwoTone'
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone'
import MarkUnreadChatAltTwoToneIcon from '@mui/icons-material/MarkUnreadChatAltTwoTone'
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone'
import RecentActorsTwoToneIcon from '@mui/icons-material/RecentActorsTwoTone'
import PersonAddAltTwoToneIcon from '@mui/icons-material/PersonAddAltTwoTone'
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone'
import FitnessCenterTwoToneIcon from '@mui/icons-material/FitnessCenterTwoTone'
import PriceChangeTwoToneIcon from '@mui/icons-material/PriceChangeTwoTone'
import WaterDropTwoToneIcon from '@mui/icons-material/WaterDropTwoTone'
import '../SideBar.css'

export default function SideBarManagerActive() {
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
    <div className='flex flex-col items-center bg-[#fff] border-r-2 border-[#d1d5dc] text-[#7A8699] h-screen'>
      {' '}
      <Link to='/admin/dashboard'>
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
        <Link to='/admin/dashboard'>
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

        {/* User */}
        <div className='w-full h-[450px] overflow-y-auto custom-scrollbar'>
          <div
            className={`flex justify-between items-center h-[50px] pl-[10px] pr-[10px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF]`}
            onClick={handleClickUser}
          >
            <div
              className={`flex items-center gap-[10px] ${path === ListUserPath || path === AddUserPath ? 'text-[#1976d3]' : ''}`}
            >
              <PersonOutlineTwoToneIcon />
              <p className=''>User</p>
            </div>
            {isOpenUser ? <ExpandLess /> : <ExpandMore />}
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isOpenUser ? 'max-h-[100px]' : 'max-h-0'}`}>
            <Link to='/admin/list-user'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === ListUserPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === ListUserPath ? 'text-[#1976d3]' : ''}`}>
                  <RecentActorsTwoToneIcon />
                  <p className='pl-4 py-2 '>List Users</p>
                </div>
              </div>
            </Link>

            <Link to='/admin/add-user'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === AddUserPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === AddUserPath ? 'text-[#1976d3]' : ''}`}>
                  <PersonAddAltTwoToneIcon />
                  <p className='pl-4 py-2'>Add User</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Service */}
          <div
            className={`flex justify-between items-center h-[50px] pl-[10px] pr-[10px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF]`}
            onClick={handleClickService}
          >
            <div
              className={`flex items-center gap-[10px] ${path === ListServicePath || path === AddServicePath ? 'text-[#1976d3]' : ''}`}
            >
              <FitnessCenterTwoToneIcon />
              <p className=''>Service</p>
            </div>
            {isOpenService ? <ExpandLess /> : <ExpandMore />}
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isOpenService ? 'max-h-[100px]' : 'max-h-0'}`}>
            <Link to='/admin/list-service'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === ListServicePath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === ListServicePath ? 'text-[#1976d3]' : ''}`}>
                  <BlurLinearIcon />
                  <p className='pl-4 py-2 '>List Services</p>
                </div>
              </div>
            </Link>

            <Link to='/admin/add-service'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === AddServicePath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === AddServicePath ? 'text-[#1976d3]' : ''}`}>
                  <FitnessCenterTwoToneIcon />
                  <p className='pl-4 py-2 '>Add Service</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Fees */}
          <div
            className={`flex justify-between items-center h-[50px] pl-[10px] pr-[10px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF]`}
            onClick={handleClickFee}
          >
            <div
              className={`flex items-center gap-[10px] ${path === ElectricityPath || path === WaterPath || path === ParkingPath ? 'text-[#1976d3]' : ''}`}
            >
              <PriceChangeTwoToneIcon />
              <p className=''>Fees</p>
            </div>
            {isOpenFee ? <ExpandLess /> : <ExpandMore />}
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isOpenFee ? 'max-h-[150px]' : 'max-h-0'}`}>
            <Link to='/admin/setting-fee-electricity'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === ElectricityPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === ElectricityPath ? 'text-[#1976d3]' : ''}`}>
                  <ElectricBoltIcon />
                  <p className='pl-4 py-2 '>Fee Electricity</p>
                </div>
              </div>
            </Link>

            <Link to='/admin/setting-fee-water'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === WaterPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === WaterPath ? 'text-[#1976d3]' : ''}`}>
                  <WaterDropTwoToneIcon />
                  <p className='pl-4 py-2 '>Fee Water</p>
                </div>
              </div>
            </Link>

            <Link to='/admin/setting-fee-parking'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === ParkingPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === ParkingPath ? 'text-[#1976d3]' : ''}`}>
                  <LocalParkingIcon />
                  <p className='pl-4 py-2 '>Fee Parking</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Apartment */}
          <div
            className={`flex justify-between items-center h-[50px] pl-[10px] pr-[10px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF]`}
            onClick={handleClickApartment}
          >
            <div
              className={`flex items-center gap-[10px] ${path === ListApartmentPath || path === AddApartmentPath ? 'text-[#1976d3]' : ''}`}
            >
              <ApartmentIcon />
              <p className=''>Apartment</p>
            </div>
            {isOpenApartment ? <ExpandLess /> : <ExpandMore />}
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${isOpenApartment ? 'max-h-[150px]' : 'max-h-0'}`}
          >
            <Link to='/admin/list-apartment'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF]  ${path === ListApartmentPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === ListApartmentPath ? 'text-[#1976d3]' : ''}`}>
                  <BusinessIcon />
                  <p className='pl-4 py-2 '>List Apartment</p>
                </div>
              </div>
            </Link>
            <Link to='/admin/add-apartment'>
              <div
                className={`flex justify-between h-[50px] pl-[20px] ml-[10px] mr-[20px] rounded-xl cursor-pointer hover:bg-[#E5F2FF] ${path === AddApartmentPath ? 'bg-[#E5F2FF] rounded-xl' : ''}`}
              >
                <div className={`flex items-center gap-[10px] ${path === AddApartmentPath ? 'text-[#1976d3]' : ''}`}>
                  <DomainAddIcon />
                  <p className='pl-4 py-2 '>Add Apartment</p>
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
            <Link to='/admin/history-notification'>
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
            <Link to='/admin/add-notification'>
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
