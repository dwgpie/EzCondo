import React, { useState } from 'react'
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material'
import {
  ExpandLess,
  ExpandMore,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Payments as PaymentsIcon,
  EditNotifications as EditNotificationsIcon
} from '@mui/icons-material'
import ReorderIcon from '@mui/icons-material/Reorder'
import Box from '@mui/material/Box'
import { Link, useLocation } from 'react-router-dom'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import RecentActorsIcon from '@mui/icons-material/RecentActors'
import PriceChangeIcon from '@mui/icons-material/PriceChange'
import AssignmentIcon from '@mui/icons-material/Assignment'
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread'
import LocalParkingIcon from '@mui/icons-material/LocalParking'
import BlurLinearIcon from '@mui/icons-material/BlurLinear'
import DeckIcon from '@mui/icons-material/Deck'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'

import '../SideBar.css'

export default function SideBarAdminActive() {
  const location = useLocation()
  const path = location.pathname

  const DashboardPath = '/admin/dashboard'
  const ListUserPath = '/admin/list-user'
  const AddUserPath = '/admin/add-user'
  const ListServicePath = '/admin/list-service'
  const CreateServicePath = '/admin/add-service'
  const ElectricityPath = '/admin/electricity'
  const WaterPath = '/admin/water'
  const ParkingPath = '/admin/parking'
  const HistoryNotificationPath = '/admin/notification'
  const CreateNotificationPath = '/admin/create-notification'

  const [isOpenDashboard, SetIsOpenDashboard] = useState(true)

  const [isOpenUser, setIsOpenUser] = useState(false)
  const [isOpenService, setIsOpenService] = useState(false)
  const [isOpenFee, setIsOpenFee] = useState(false)
  const [isOpenNotification, setIsOpenNotification] = useState(false)

  const handleClickDashboard = () => {
    SetIsOpenDashboard(!isOpenDashboard)
  }
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

  const isActive = () => {}

  return (
    <div className='flex flex-col items-center bg-[#fff] border-r-2 border-[#d1d5dc] text-[#333] h-screen w-full relative'>
      <Link to='/admin/dashboard'>
        <div className='w-20 h-20'>
          <img src='/public/imgs/logo/lo23-Photoroom.png' className='w-full h-full object-cover' />
        </div>
      </Link>

      <div className='w-full font-semibold'>
        <div className='flex items-center justify-between gap-[10px] h-[50px] pl-[20px] pr-[20px]'>
          <p className='' onClick={handleClickUser}>
            Dashboard
          </p>
          <div className='w-[70%] h-[1px] bg-[#bdbdbd]'></div>
        </div>

        <Link to='/admin/dashboard'>
          <div className='flex justify-between  h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
            <div className={`flex items-center gap-[10px] ${path === DashboardPath ? 'text-[#1976d3]' : ''}`}>
              <DashboardIcon />
              <p>Dashboard</p>
            </div>
          </div>
        </Link>

        <div className='flex items-center justify-between gap-[10px] h-[50px] pl-[20px] pr-[20px]'>
          <p>Feature</p>
          <div className='w-[70%] h-[1px] bg-[#bdbdbd]'></div>
        </div>
        <div className='w-full h-[450px] overflow-y-auto custom-scrollbar'>
          <div
            className='flex justify-between items-center h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10 '
            onClick={handleClickUser}
          >
            <div className={`flex items-center gap-[10px] ${path === ListUserPath ? 'text-[#1976d3]' : ''}`}>
              <RecentActorsIcon />
              <p className=''>User</p>
            </div>
            {isOpenUser ? <ExpandLess /> : <ExpandMore />}
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isOpenUser ? 'max-h-[100px]' : 'max-h-0'}`}>
            <Link to='/admin/list-user'>
              <div className='flex justify-between h-[50px] pl-[30px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                <div className={`flex items-center gap-[10px] ${path === ListUserPath ? 'text-[#1976d3]' : ''}`}>
                  <RecentActorsIcon />
                  <p className='pl-4 py-2 '>List users</p>
                </div>
              </div>
            </Link>

            <Link to='/admin/add-user'>
              <div className='flex justify-between h-[50px] pl-[30px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                <div className={`flex items-center gap-[10px] ${path === AddUserPath ? 'text-[#1976d3]' : ''}`}>
                  <PersonAddAltIcon />
                  <p className='pl-4 py-2'>Add users</p>
                </div>
              </div>
            </Link>
          </div>

          <div
            className='flex justify-between items-center h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'
            onClick={handleClickService}
          >
            <div
              className={`flex items-center gap-[10px] ${path === ListServicePath || path === CreateServicePath ? 'text-[#1976d3]' : ''}`}
            >
              <DeckIcon />
              <p className=''>Service</p>
            </div>
            {isOpenService ? <ExpandLess /> : <ExpandMore />}
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isOpenService ? 'max-h-[100px]' : 'max-h-0'}`}>
            <Link to='/admin/list-service'>
              <div className='flex justify-between h-[50px] pl-[30px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                <div className={`flex items-center gap-[10px] ${path === ListServicePath ? 'text-[#1976d3]' : ''}`}>
                  <BlurLinearIcon />
                  <p className='pl-4 py-2 '>List services</p>
                </div>
              </div>
            </Link>

            <Link to='/admin/add-service'>
              <div className='flex justify-between h-[50px] pl-[30px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                <div className={`flex items-center gap-[10px] ${path === CreateServicePath ? 'text-[#1976d3]' : ''}`}>
                  <DeckIcon />
                  <p className='pl-4 py-2 '>Create service</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Fees */}
          <div
            className='flex justify-between items-center h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'
            onClick={handleClickFee}
          >
            <div
              className={`flex items-center gap-[10px] ${path === ElectricityPath || path === WaterPath || path === ParkingPath ? 'text-[#1976d3]' : ''}`}
            >
              <PriceChangeIcon />
              <p className=''>Fees</p>
            </div>
            {isOpenFee ? <ExpandLess /> : <ExpandMore />}
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${isOpenFee ? 'max-h-[150px]' : 'max-h-0'}`}>
            <Link to='/admin/electricity'>
              <div className='flex justify-between h-[50px] pl-[30px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                <div className={`flex items-center gap-[10px] ${path === ElectricityPath ? 'text-[#1976d3]' : ''}`}>
                  <PriceChangeIcon />
                  <p className='pl-4 py-2'>Set Fees</p>
                </div>
              </div>
            </Link>
          </div>
          {/* Notification */}
          <div
            className='flex justify-between items-center h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'
            onClick={handleClickNotification}
          >
            <div
              className={`flex items-center gap-[10px] ${path === HistoryNotificationPath || path === CreateNotificationPath ? 'text-[#1976d3]' : ''}`}
            >
              <MarkEmailUnreadIcon />
              <p className=''>Notification</p>
            </div>
            {isOpenNotification ? <ExpandLess /> : <ExpandMore />}
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${isOpenNotification ? 'max-h-[100px]' : 'max-h-0'}`}
          >
            <Link to='/admin/notification'>
              <div className='flex justify-between h-[50px] pl-[30px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                <div
                  className={`flex items-center gap-[10px] ${path === HistoryNotificationPath ? 'text-[#1976d3]' : ''}`}
                >
                  <AssignmentIcon />
                  <p className='pl-4 py-2 '>History notification</p>
                </div>
              </div>
            </Link>

            <Link to='/admin/create-notification'>
              <div className='flex justify-between h-[50px] pl-[30px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                <div
                  className={`flex items-center gap-[10px] ${path === CreateNotificationPath ? 'text-[#1976d3]' : ''}`}
                >
                  <MarkChatUnreadIcon />
                  <p className='pl-4 py-2 '>Create notification</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
