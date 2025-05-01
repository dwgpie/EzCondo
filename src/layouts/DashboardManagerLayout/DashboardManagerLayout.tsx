import React, { useState } from 'react'
import Header from '~/components/Header'
import SideBarManagerActive from '~/components/SideBar/SideBarManager'
import SideBarManagerInactive from '~/components/SideBar/SideBarManager/SideBarManagerInactive'
interface Props {
  children?: React.ReactNode
}

export default function DashboardManagerLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true)

  const activeSideBar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='flex bg-[#efeff4] min-h-screen'>
      <div className={`transition-all duration-300 h-screen ${isOpen ? 'w-[20%]' : 'w-[7.5%]'} fixed z-100`}>
        <div className='relative w-full'>
          <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <SideBarManagerActive />
          </div>

          <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-0 hidden' : 'opacity-100'}`}>
            <SideBarManagerInactive />
          </div>

          <button
            className={`absolute top-4 -right-3 z-50 p-1.5 rounded-full bg-white shadow-md 
              hover:shadow-lg transform transition-all duration-200 hover:scale-105
              border border-gray-100 focus:outline-none cursor-pointer
              ${isOpen ? 'hover:bg-gray-50' : 'hover:bg-blue-50'}`}
            onClick={activeSideBar}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 text-gray-600'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 text-gray-600'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            )}
          </button>
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
