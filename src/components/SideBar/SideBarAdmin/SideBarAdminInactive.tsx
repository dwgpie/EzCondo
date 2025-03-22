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
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'
import PriceChangeIcon from '@mui/icons-material/PriceChange'
import ReorderIcon from '@mui/icons-material/Reorder'
import Box from '@mui/material/Box'
import { Link, useLocation } from 'react-router-dom'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import RecentActorsIcon from '@mui/icons-material/RecentActors'
import CustomListItemButton from '../../CustomListItemButton'
import BuildIcon from '@mui/icons-material/Build'
import BlurLinearIcon from '@mui/icons-material/BlurLinear'
import DeckIcon from '@mui/icons-material/Deck'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import AssignmentIcon from '@mui/icons-material/Assignment'
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread'
import '../SideBar.css'

export default function SideBarAdminInactive() {
  const location = useLocation()
  const path = location.pathname

  const DashboardPath = '/admin/dashboard'
  const ListUserPath = '/admin/list-user'
  const AddUserPath = '/admin/add-user'
  const ListServicePath = '/admin/list-service'
  const CreateServicePath = '/admin/add-service'
  const SetFeePath = '/admin/set-fee'
  const HistoryNotificationPath = '/admin/notification'
  const CreateNotificationPath = '/admin/create-notification'

  const [isOpenUser, setIsOpenUser] = useState(false)
  const [isOpenService, setIsOpenService] = useState(false)
  const [isOpenFee, setIsOpenFee] = useState(false)
  const [isOpenNotification, setIsOpenNotification] = useState(false)

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

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className='flex flex-col items-center bg-[#fff] border-r-2 border-[#d1d5dc] text-[#333] h-screen w-full relative'>
      <div className='w-20 h-20'>
        <img src='/public/imgs/logo/lo23-Photoroom.png' className='w-full h-full object-cover' />
      </div>

      <div className='w-full font-semibold flex flex-col items-center  '>
        <div className='flex items-center h-[50px]'>
          <p className='text-[14px]'>Dashboard</p>
        </div>

        <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
          <Link to='/admin/dashboard'>
            <div className='flex justify-between  h-[50px] pl-[20px] pr-[20px] '>
              <div className={`flex items-center gap-[10px] ${path === DashboardPath ? 'text-[#1976d3]' : ''}`}>
                <DashboardIcon />
              </div>
            </div>
          </Link>
        </div>

        <div className='flex items-center h-[50px] '>
          <p className='text-[14px]'>Feature</p>
        </div>
        <div className='w-full h-[450px] flex flex-col items-center '>
          {/* User */}
          <div className='relative group'>
            {/* Nút bấm */}
            <div className='flex justify-between w-full h-[50px] pl-[40px] pr-[40px] cursor-pointer hover:bg-[#333]/10'>
              <div
                className={`flex items-center gap-[10px] ${path === ListUserPath || path === AddUserPath ? 'text-[#1976d3]' : ''}`}
              >
                <RecentActorsIcon />
              </div>
            </div>

            {/* Hover Menu */}
            <div className='absolute w-[200px] border-2 border-[#d1d5dc] rounded-[5px] bg-white shadow-md top-[0] left-[105px] hidden group-hover:block z-[9999]'>
              <ul>
                <Link to='/admin/list-user'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div className={`flex items-center gap-[10px] ${path === ListUserPath ? 'text-[#1976d3]' : ''}`}>
                      <RecentActorsIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>List User</li>
                    </div>
                  </div>
                </Link>
                <Link to='/admin/add-user'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div className={`flex items-center gap-[10px] ${path === AddUserPath ? 'text-[#1976d3]' : ''}`}>
                      <PersonAddAltIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>Create User</li>
                    </div>
                  </div>
                </Link>
              </ul>
            </div>
          </div>

          {/* Service */}
          <div className='relative group'>
            {/* Nút bấm */}
            <div className='flex justify-between w-full h-[50px] pl-[40px] pr-[40px] cursor-pointer hover:bg-[#333]/10'>
              <div
                className={`flex items-center gap-[10px] ${path === ListServicePath || path === CreateServicePath ? 'text-[#1976d3]' : ''}`}
              >
                <DeckIcon />
              </div>
            </div>

            {/* Hover Menu */}
            <div className='absolute w-[200px] border-2 border-[#d1d5dc] rounded-[5px] bg-white shadow-md top-[0] left-[105px] hidden group-hover:block z-[9999]'>
              <ul>
                <Link to='/admin/list-service'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div className={`flex items-center gap-[10px] ${path === ListServicePath ? 'text-[#1976d3]' : ''}`}>
                      <BlurLinearIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>List Service</li>
                    </div>
                  </div>
                </Link>
                <Link to='/admin/add-service'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div
                      className={`flex items-center gap-[10px] ${path === CreateServicePath ? 'text-[#1976d3]' : ''}`}
                    >
                      <DeckIcon />
                      <li className='flex items-center h-[30px] pl-[10px]'>Add Service</li>
                    </div>
                  </div>
                </Link>
              </ul>
            </div>
          </div>

          {/* Fee */}
          <div className='relative group'>
            {/* Nút bấm */}
            <div className='flex justify-between w-full h-[50px] pl-[40px] pr-[40px] cursor-pointer hover:bg-[#333]/10'>
              <div className={`flex items-center gap-[10px] ${path === SetFeePath ? 'text-[#1976d3]' : ''}`}>
                <PriceChangeIcon />
              </div>
            </div>

            {/* Hover Menu */}
            <div className='absolute w-[200px] border-2 border-[#d1d5dc] rounded-[5px] bg-white shadow-md top-[0] left-[105px] hidden group-hover:block z-[9999]'>
              <ul>
                <Link to='/admin/set-fee'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div className={`flex items-center gap-[10px] ${path === SetFeePath ? 'text-[#1976d3]' : ''}`}>
                      <PriceChangeIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>Set Fees</li>
                    </div>
                  </div>
                </Link>
              </ul>
            </div>
          </div>

          {/* Notification */}
          <div className='relative group'>
            {/* Nút bấm */}
            <div className='flex justify-between w-full h-[50px] pl-[40px] pr-[40px] cursor-pointer hover:bg-[#333]/10'>
              <div
                className={`flex items-center gap-[10px] ${path === HistoryNotificationPath || path === CreateNotificationPath ? 'text-[#1976d3]' : ''}`}
              >
                <MarkEmailUnreadIcon />
              </div>
            </div>

            {/* Hover Menu */}
            <div className='absolute w-[200px] border-2 border-[#d1d5dc] rounded-[5px] bg-white shadow-md top-[0] left-[105px] hidden group-hover:block z-[9999]'>
              <ul>
                <Link to='/admin/notification'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div
                      className={`flex items-center gap-[10px] ${path === HistoryNotificationPath ? 'text-[#1976d3]' : ''}`}
                    >
                      <AssignmentIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>History Notification</li>
                    </div>
                  </div>
                </Link>
                <Link to='/admin/create-notification'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div
                      className={`flex items-center gap-[10px] ${path === CreateNotificationPath ? 'text-[#1976d3]' : ''}`}
                    >
                      <MarkChatUnreadIcon />
                      <li className='flex items-center h-[30px] pl-[10px]'>Create Notification</li>
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
