import React from 'react'
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
import Box from '@mui/material/Box'
import { Link, useLocation } from 'react-router-dom'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import RecentActorsIcon from '@mui/icons-material/RecentActors'
import CustomListItemButton from '../../CustomListItemButton'
import BuildIcon from '@mui/icons-material/Build'
import BlurLinearIcon from '@mui/icons-material/BlurLinear'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import '../SideBar.css'

export default function SideBarAdmin() {
  const [open, setOpen] = React.useState(true)
  const [open2, setOpen2] = React.useState(true)
  const location = useLocation()

  const handleClick = () => {
    setOpen(!open)
  }

  const handleClick2 = () => {
    setOpen2(!open2)
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    // <div className='bg-gray-100 z-11'>
    //   <div className='grid grid-cols-10 gap-10 items-center'>
    //     <div className='col-span-1'></div>
    //     <div className='col-span-2'>

    //     </div>
    //     <div className='col-span-6'></div>
    //     <div className='col-span-1'></div>
    //   </div>
    // </div>
    <div className='h-[calc(100vh-120px)] overflow-y-auto pr-4 custom-scrollba w-[260px]'>
      <div>
        <Link to='/admin/dashboard'>
          <CustomListItemButton icon={<DashboardIcon />} text='Dashboard' isActive={isActive('/admin/dashboard')} />
        </Link>
        <div className='flex items-center'>
          <span className='mr-3 text-gray-500'>Feature</span>
          <span className='h-[1px] w-80 bg-gray-300' />
        </div>
        <List component='nav'>
          <CustomListItemButton
            icon={<PersonIcon />}
            text='User'
            onClick={handleClick}
            endIcon={<Box>{open ? <ExpandLess /> : <ExpandMore />}</Box>}
          />
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Link to='/admin/list-user'>
              <CustomListItemButton
                isActive={isActive('/admin/list-user')}
                pl={4}
                py={0.5}
                icon={<RecentActorsIcon />}
                text='List Users'
              />
            </Link>
            <Link to='/admin/add-user'>
              <CustomListItemButton
                icon={<PersonAddAltIcon />}
                text='Add User'
                isActive={isActive('/admin/add-user')}
                pl={4}
                py={0.5}
              />
            </Link>
          </Collapse>
        </List>

        <List component='nav' sx={{ marginTop: '-10px' }}>
          <CustomListItemButton
            icon={<FormatListBulletedIcon />}
            text='Manage list of fees'
            onClick={handleClick2}
            endIcon={<Box>{open2 ? <ExpandLess /> : <ExpandMore />}</Box>}
          />
          <Collapse in={open2} timeout='auto' unmountOnExit>
            <Link to='/admin/fixed-fee'>
              <CustomListItemButton
                icon={<BuildIcon />}
                text='Fixed Fees'
                isActive={isActive('/admin/fixed-fee')}
                pl={4}
                py={0.5}
              />
            </Link>
            <Link to='/admin/services'>
              <CustomListItemButton
                icon={<BlurLinearIcon />}
                text='Services'
                isActive={isActive('/admin/services')}
                pl={4}
                py={0.5}
              />
            </Link>
            <Link to='/admin/electricity'>
              <CustomListItemButton
                icon={<ElectricBoltIcon />}
                text='Electricity'
                isActive={isActive('/admin/electricity')}
                pl={4}
                py={0.5}
              />
            </Link>
            <Link to='/admin/water'>
              <CustomListItemButton
                icon={<WaterDropIcon />}
                text='Water'
                isActive={isActive('/admin/water')}
                pl={4}
                py={0.5}
              />
            </Link>
          </Collapse>
        </List>
        <ListItemButton
          sx={{
            marginLeft: '-20px',
            py: 0.5
          }}
        >
          <ListItemIcon sx={{ minWidth: '35px' }}>
            <PaymentsIcon />
          </ListItemIcon>
          <ListItemText primary='Invoice & payment notification' />
        </ListItemButton>
        <ListItemButton
          sx={{
            marginLeft: '-20px',
            py: 0.5
          }}
        >
          <ListItemIcon sx={{ minWidth: '35px' }}>
            <FormatListBulletedIcon />
          </ListItemIcon>
          <ListItemText primary='Payment & Debt Management' />
        </ListItemButton>
        <ListItemButton
          sx={{
            marginLeft: '-20px',
            py: 0.5
          }}
        >
          <ListItemIcon sx={{ minWidth: '35px' }}>
            <FormatListBulletedIcon />
          </ListItemIcon>
          <ListItemText primary='Operating cost management' />
        </ListItemButton>
        <ListItemButton
          sx={{
            marginLeft: '-20px',
            py: 0.5
          }}
        >
          <ListItemIcon sx={{ minWidth: '35px' }}>
            <EditNotificationsIcon />
          </ListItemIcon>
          <ListItemText primary='Notification management' />
        </ListItemButton>
      </div>
    </div>
  )
}
