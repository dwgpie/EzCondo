import React, { useState } from 'react'
import Header from '~/components/Header'
import SideBarAdminActive from '~/components/SideBar/SideBarAdmin'
import SideBarAdminInactive from '~/components/SideBar/SideBarAdmin/SideBarAdminInactive'
import ReorderIcon from '@mui/icons-material/Reorder'
import SortIcon from '@mui/icons-material/Sort'

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
      <div className={`transition-all duration-300 h-screen ${isOpen ? 'w-[20%]' : 'w-[7%]'} fixed z-100`}>
        <div className='relative w-full'>
          <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <SideBarAdminActive />
          </div>

          <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-0 hidden' : 'opacity-100'}`}>
            <SideBarAdminInactive />
          </div>

          {isOpen ? (
            <div
              className='rounded-full w-[30px] h-[30px] border-2 border-[#d1d5dc] bg-[#fff] text-center absolute top-[28px] right-[-15px] z-100 cursor-pointer'
              onClick={activeSideBar}
            >
              <ReorderIcon />
            </div>
          ) : (
            <div
              className='rounded-full w-[30px] h-[30px] border-2 border-[#d1d5dc] bg-[#fff] text-center absolute top-[28px] right-[-15px] z-100 cursor-pointer'
              onClick={activeSideBar}
            >
              <SortIcon />
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex justify-end transition-all duration-300 relative  ${isOpen ? 'w-[80%] ml-[20%]' : 'w-[93%] ml-[7%]'} z-1`}
      >
        <div className={`fixed transition-all duration-300 z-50 ${isOpen ? 'w-[80%]' : 'w-[93%]'}`}>
          <Header />
        </div>
        <div className='overflow-y-auto custom-scrollbar w-full mt-[80px]'>{children}</div>
      </div>
    </div>
  )
}
