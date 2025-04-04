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

export default function SideBarAdminInactive() {
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

  return (
    <div className='flex flex-col items-center bg-[#fff] border-r-2 border-[#d1d5dc] text-[#333] h-screen w-full'>
      <Link to='/admin/dashboard'>
        <div className='w-20 h-20'>
          <img src='/public/imgs/logo/lo23-Photoroom.png' className='w-full h-full object-cover' />
        </div>
      </Link>

      <div className='w-full font-semibold flex flex-col items-center  '>
        {/* Dashboard */}
        <div className='flex items-center h-[50px]'>
          <p className='text-[14px]'>Dashboard</p>
        </div>

        <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
          <Link to='/admin/dashboard'>
            <div className='flex justify-between  h-[50px] pl-[20px] pr-[20px] '>
              <div className={`flex items-center gap-[10px] ${path === DashboardPath ? 'text-[#1976d3]' : ''}`}>
                <DashboardTwoToneIcon />
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
                <PersonOutlineTwoToneIcon />
              </div>
            </div>

            {/* Hover Menu */}
            <div className='absolute w-[200px] border-2 border-[#d1d5dc] rounded-[5px] bg-white shadow-md top-[0] left-[105px] hidden group-hover:block z-[9999]'>
              <ul>
                <Link to='/admin/list-user'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div className={`flex items-center gap-[10px] ${path === ListUserPath ? 'text-[#1976d3]' : ''}`}>
                      <RecentActorsTwoToneIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>List User</li>
                    </div>
                  </div>
                </Link>
                <Link to='/admin/add-user'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div className={`flex items-center gap-[10px] ${path === AddUserPath ? 'text-[#1976d3]' : ''}`}>
                      <PersonAddAltTwoToneIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>Add User</li>
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
                className={`flex items-center gap-[10px] ${path === ListServicePath || path === AddServicePath ? 'text-[#1976d3]' : ''}`}
              >
                <FitnessCenterTwoToneIcon />
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
                    <div className={`flex items-center gap-[10px] ${path === AddServicePath ? 'text-[#1976d3]' : ''}`}>
                      <FitnessCenterTwoToneIcon />
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
              <div
                className={`flex items-center gap-[10px] ${path === ElectricityPath || path === WaterPath || path === ParkingPath ? 'text-[#1976d3]' : ''}`}
              >
                <PriceChangeTwoToneIcon />
              </div>
            </div>

            {/* Hover Menu */}
            <div className='absolute w-[200px] border-2 border-[#d1d5dc] rounded-[5px] bg-white shadow-md top-[0] left-[105px] hidden group-hover:block z-[9999]'>
              <ul>
                <Link to='/admin/setting-fee-electricity'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div className={`flex items-center gap-[10px] ${path === ElectricityPath ? 'text-[#1976d3]' : ''}`}>
                      <ElectricBoltIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>Fee Electricity</li>
                    </div>
                  </div>
                </Link>
                <Link to='/admin/setting-fee-water'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div className={`flex items-center gap-[10px] ${path === WaterPath ? 'text-[#1976d3]' : ''}`}>
                      <WaterDropTwoToneIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>Fee Water</li>
                    </div>
                  </div>
                </Link>
                <Link to='/admin/setting-fee-parking'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div className={`flex items-center gap-[10px] ${path === ParkingPath ? 'text-[#1976d3]' : ''}`}>
                      <LocalParkingIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>Fee Parking</li>
                    </div>
                  </div>
                </Link>
              </ul>
            </div>
          </div>

          {/* Apartment */}
          <div className='relative group'>
            {/* Nút bấm */}
            <div className='flex justify-between w-full h-[50px] pl-[40px] pr-[40px] cursor-pointer hover:bg-[#333]/10'>
              <div
                className={`flex items-center gap-[10px] ${path === ListApartmentPath || path === AddApartmentPath ? 'text-[#1976d3]' : ''}`}
              >
                <ApartmentIcon />
              </div>
            </div>

            {/* Hover Menu */}
            <div className='absolute w-[200px] border-2 border-[#d1d5dc] rounded-[5px] bg-white shadow-md top-[0] left-[105px] hidden group-hover:block z-[9999]'>
              <ul>
                <Link to='/admin/list-apartment'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div
                      className={`flex items-center gap-[10px] ${path === ListApartmentPath ? 'text-[#1976d3]' : ''}`}
                    >
                      <BusinessIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>List Apartment</li>
                    </div>
                  </div>
                </Link>
                <Link to='/admin/add-apartment'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div
                      className={`flex items-center gap-[10px] ${path === AddApartmentPath ? 'text-[#1976d3]' : ''}`}
                    >
                      <DomainAddIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>Add Apartment</li>
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
                className={`flex items-center gap-[10px] ${path === HistoryNotificationPath || path === AddNotificationPath ? 'text-[#1976d3]' : ''}`}
              >
                <MarkUnreadChatAltTwoToneIcon />
              </div>
            </div>

            {/* Hover Menu */}
            <div className='absolute w-[200px] border-2 border-[#d1d5dc] rounded-[5px] bg-white shadow-md top-[0] left-[105px] hidden group-hover:block z-[9999]'>
              <ul>
                <Link to='/admin/history-notification'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div
                      className={`flex items-center gap-[10px] ${path === HistoryNotificationPath ? 'text-[#1976d3]' : ''}`}
                    >
                      <AssignmentTwoToneIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>History Notify</li>
                    </div>
                  </div>
                </Link>
                <Link to='/admin/add-notification'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div
                      className={`flex items-center gap-[10px] ${path === AddNotificationPath ? 'text-[#1976d3]' : ''}`}
                    >
                      <EditNotificationsTwoToneIcon />
                      <li className='flex items-center h-[30px] pl-[10px]'>Add Notify</li>
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
