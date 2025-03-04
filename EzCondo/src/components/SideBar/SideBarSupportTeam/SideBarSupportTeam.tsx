import React from 'react'
import { List, Collapse } from '@mui/material'
import Box from '@mui/material/Box'
import { Link, useLocation } from 'react-router-dom'
import CustomListItemButton from '../../CustomListItemButton'
import '../SideBar.css'
import EditNotificationsIcon from '@mui/icons-material/EditNotifications'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import NotificationAddIcon from '@mui/icons-material/NotificationAdd'
import ListIcon from '@mui/icons-material/List'

export default function SideBarSupportTeam() {
  const [open, setOpen] = React.useState(true)
  const location = useLocation()

  const handleClick = () => {
    setOpen(!open)
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
        <div className='flex items-center mb-2'>
          <span className='mr-3 text-gray-500'>Feature</span>
          <span className='h-[1px] w-80 bg-gray-300' />
        </div>
        <Link to='/support-team/manage-incident'>
          <CustomListItemButton
            icon={<DashboardIcon />}
            text='Manage list of incidents'
            isActive={isActive('/support-team/manage-incident')}
          />
        </Link>

        <List component='nav'>
          <CustomListItemButton
            icon={<EditNotificationsIcon />}
            text='Notify management'
            onClick={handleClick}
            endIcon={<Box>{open ? <ExpandLess /> : <ExpandMore />}</Box>}
          />
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Link to='/admin/add-use'>
              <CustomListItemButton
                icon={<ListIcon />}
                text='Manage Notification'
                isActive={isActive('/admin/add-use')}
                pl={4}
                py={0.5}
              />
            </Link>
            <Link to='/support-team/manage-incident'>
              <CustomListItemButton
                icon={<NotificationAddIcon />}
                text='Add Notification'
                isActive={isActive('/support-team/manage')}
                pl={4}
                py={0.5}
              />
            </Link>
          </Collapse>
        </List>
      </div>
    </div>
  )
}
