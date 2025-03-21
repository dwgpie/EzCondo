import React, { useState } from 'react'
import Header from '~/components/Header'
import SideBarAdminActive from '~/components/SideBar/SideBarAdmin'
import SideBarAdminInactive from '~/components/SideBar/SideBarAdmin/SideBarAdminInactive'
import ReorderIcon from '@mui/icons-material/Reorder'

interface Props {
  children?: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true)

  const activeSideBar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='flex bg-[#EDF2F9] h-full  '>
      <div className={` relative transition-all duration-300 ${isOpen ? 'w-[20%]' : 'w-[7%]'}`}>
        <div className='relative w-full'>
          <div
            className='rounded-full w-[30px] h-[30px] border-2 border-[#d1d5dc] bg-[#fff] text-center absolute top-[28px] right-[-15px] z-10 cursor-pointer'
            onClick={activeSideBar}
          >
            <ReorderIcon />
          </div>

          <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <SideBarAdminActive />
          </div>

          <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-0 hidden' : 'opacity-100'}`}>
            <SideBarAdminInactive />
          </div>
        </div>
      </div>

      <div className={`transition-all duration-300 ${isOpen ? 'w-[80%]' : 'w-[93%]'} z-1`}>
        <Header />
        {children}
      </div>
    </div>
  )
}
