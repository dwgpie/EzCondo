import React, { useState } from 'react'
import Header from '~/components/Header'
import SideBarAdminActive from '~/components/SideBar/SideBarAdmin'
import SideBarAdminInactive from '~/components/SideBar/SideBarAdmin/SideBarAdminInactive'
interface Props {
  children?: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true)

  const activeSideBar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='flex bg-[#f9fafb] min-h-screen'>
      <div className={`transition-all duration-300 h-screen ${isOpen ? 'w-[20%]' : 'w-[7.5%]'} fixed z-100`}>
        <div className='relative w-full'>
          <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <SideBarAdminActive />
          </div>

          <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-0 hidden' : 'opacity-100'}`}>
            <SideBarAdminInactive />
          </div>

          {isOpen ? (
            <div
              className='rounded-full p-2 border-1 text-[#576367] border-[#576367] hover:bg-[#eaf3fd] bg-[#fff] text-center absolute bottom-[22px] right-[-16px] z-100 cursor-pointer'
              onClick={activeSideBar}
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                <path
                  fill='currentColor'
                  d='M11.28 9.53L8.81 12l2.47 2.47a.749.749 0 0 1-.326 1.275a.75.75 0 0 1-.734-.215l-3-3a.75.75 0 0 1 0-1.06l3-3a.749.749 0 0 1 1.275.326a.75.75 0 0 1-.215.734'
                />
                <path
                  fill='currentColor'
                  d='M3.75 2h16.5c.966 0 1.75.784 1.75 1.75v16.5A1.75 1.75 0 0 1 20.25 22H3.75A1.75 1.75 0 0 1 2 20.25V3.75C2 2.784 2.784 2 3.75 2M3.5 3.75v16.5c0 .138.112.25.25.25H15v-17H3.75a.25.25 0 0 0-.25.25m13 16.75h3.75a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25H16.5Z'
                />
              </svg>{' '}
            </div>
          ) : (
            <div
              className='rounded-full p-2 border-1 text-[#576367] border-[#576367] hover:bg-[#eaf3fd] bg-[#fff] text-center absolute bottom-[22px] right-[-16px] z-100 cursor-pointer'
              onClick={activeSideBar}
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                <path
                  fill='currentColor'
                  d='M7.22 14.47L9.69 12L7.22 9.53a.749.749 0 0 1 .326-1.275a.75.75 0 0 1 .734.215l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 0 1-1.042-.018a.75.75 0 0 1-.018-1.042'
                />
                <path
                  fill='currentColor'
                  d='M3.75 2h16.5c.966 0 1.75.784 1.75 1.75v16.5A1.75 1.75 0 0 1 20.25 22H3.75A1.75 1.75 0 0 1 2 20.25V3.75C2 2.784 2.784 2 3.75 2M3.5 3.75v16.5c0 .138.112.25.25.25H15v-17H3.75a.25.25 0 0 0-.25.25m13 16.75h3.75a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25H16.5Z'
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex justify-end transition-all duration-300 relative  ${isOpen ? 'w-[80%] ml-[20%]' : 'w-[92.5%] ml-[7.5%]'} z-1`}
      >
        <div className={`fixed transition-all duration-300 z-50 ${isOpen ? 'w-[80%]' : 'w-[93%]'}`}>
          <Header />
        </div>
        <div className='w-full mt-[80px]'>{children}</div>
      </div>
    </div>
  )
}
