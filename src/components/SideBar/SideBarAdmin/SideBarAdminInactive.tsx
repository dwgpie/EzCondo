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
import '../SideBar.css'

export default function SideBarAdminInactive() {
  const location = useLocation()

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
          <div className='flex items-center gap-[10px]'>
            <DashboardIcon />
          </div>
        </div>

        <div className='flex items-center h-[50px] '>
          <p className='text-[14px]'>Feature</p>
        </div>
        <div className='w-full h-[450px] flex flex-col items-center '>
          <div className='relative group'>
            {/* Nút bấm */}
            <div className='flex justify-between w-full h-[50px] pl-[40px] pr-[40px] cursor-pointer hover:bg-[#333]/10'>
              <div className='flex items-center'>
                <RecentActorsIcon />
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className='absolute ml-[30px] w-[150px] border-2 border-[#d1d5dc] rounded-[5px] bg-white shadow-md top-[0] left-[120px] hidden group-hover:block z-[9999]'>
              <ul>
                <li className='flex items-center h-[30px] pl-[10px] hover:bg-[#ddd] cursor-pointer'>List User</li>
                <li className='flex items-center h-[30px] pl-[10px] hover:bg-[#ddd] cursor-pointer'>Create User</li>
              </ul>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${isOpenUser ? 'max-h-[100px]' : 'max-h-0'}`}
          ></div>

          <div
            className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-white/10'
            onClick={handleClickService}
          >
            <div className='flex items-center gap-[10px]'>
              <DeckIcon />
            </div>
          </div>

          {/* Fees */}
          <div
            className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-white/10'
            onClick={handleClickFee}
          >
            <div className='flex items-center gap-[10px]'>
              <PriceChangeIcon />
            </div>
          </div>

          {/* Notification */}
          <div
            className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-white/10'
            onClick={handleClickNotification}
          >
            <div className='flex items-center gap-[10px]'>
              <MarkEmailUnreadIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
