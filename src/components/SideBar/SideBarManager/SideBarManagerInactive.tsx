import { Link, useLocation } from 'react-router-dom'
import BlurLinearIcon from '@mui/icons-material/BlurLinear'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import EditNotificationsTwoToneIcon from '@mui/icons-material/EditNotificationsTwoTone'
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone'
import MarkUnreadChatAltTwoToneIcon from '@mui/icons-material/MarkUnreadChatAltTwoTone'
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone'
import RecentActorsTwoToneIcon from '@mui/icons-material/RecentActorsTwoTone'
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone'
import FitnessCenterTwoToneIcon from '@mui/icons-material/FitnessCenterTwoTone'
import WaterDropTwoToneIcon from '@mui/icons-material/WaterDropTwoTone'
import '../SideBar.css'

export default function SideBarManagerInactive() {
  const location = useLocation()
  const path = location.pathname

  const DashboardPath = '/manager/dashboard'
  const ListUserPath = '/manager/list-resident'
  const ListServicePath = '/manager/list-service'
  const ListElectricityPath = '/manager/list-electricity'
  const ImportElectricPath = '/manager/import-electric-number'
  const ListElectricUnpaidPath = '/manager/import-electric-unpaid'
  const ListWaterPath = '/manager/list-water'
  const ImportWaterPath = '/manager/import-water-number'
  const ListWaterUnpaidPath = '/manager/import-water-unpaid'
  const HistoryNotificationPath = '/manager/history-notification'
  const AddNotificationPath = '/manager/add-notification'

  return (
    <div className='flex flex-col items-center bg-[#fff] border-r-2 border-[#d1d5dc] text-[#333] h-screen w-full'>
      <Link to='/manager/dashboard'>
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
          <Link to='/manager/dashboard'>
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
              <div className={`flex items-center gap-[10px] ${path === ListUserPath ? 'text-[#1976d3]' : ''}`}>
                <PersonOutlineTwoToneIcon />
              </div>
            </div>

            {/* Hover Menu */}
            <div className='absolute w-[200px] border-2 border-[#d1d5dc] rounded-[5px] bg-white shadow-md top-[0] left-[105px] hidden group-hover:block z-[9999]'>
              <ul>
                <Link to='/manager/list-resident'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div className={`flex items-center gap-[10px] ${path === ListUserPath ? 'text-[#1976d3]' : ''}`}>
                      <RecentActorsTwoToneIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>List Resident</li>
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
              <div className={`flex items-center gap-[10px] ${path === ListServicePath ? 'text-[#1976d3]' : ''}`}>
                <FitnessCenterTwoToneIcon />
              </div>
            </div>

            {/* Hover Menu */}
            <div className='absolute w-[200px] border-2 border-[#d1d5dc] rounded-[5px] bg-white shadow-md top-[0] left-[105px] hidden group-hover:block z-[9999]'>
              <ul>
                <Link to='/manager/list-service'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div className={`flex items-center gap-[10px] ${path === ListServicePath ? 'text-[#1976d3]' : ''}`}>
                      <BlurLinearIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>List Service</li>
                    </div>
                  </div>
                </Link>
              </ul>
            </div>
          </div>

          {/* Electricity */}
          <div className='relative group'>
            {/* Nút bấm */}
            <div className='flex justify-between w-full h-[50px] pl-[40px] pr-[40px] cursor-pointer hover:bg-[#333]/10'>
              <div
                className={`flex items-center gap-[10px] ${path === ListElectricityPath || path === ListElectricUnpaidPath || path === ImportElectricPath ? 'text-[#1976d3]' : ''}`}
              >
                <ElectricBoltIcon />
              </div>
            </div>

            {/* Hover Menu */}
            <div className='absolute w-[200px] border-2 border-[#d1d5dc] rounded-[5px] bg-white shadow-md top-[0] left-[105px] hidden group-hover:block z-[9999]'>
              <ul>
                <Link to='/manager/list-electricity'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div
                      className={`flex items-center gap-[10px] ${path === ListElectricityPath ? 'text-[#1976d3]' : ''}`}
                    >
                      <ElectricBoltIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>List Electric</li>
                    </div>
                  </div>
                </Link>
                <Link to='/manager/import-electric-unpaid'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div
                      className={`flex items-center gap-[10px] ${path === ListElectricUnpaidPath ? 'text-[#1976d3]' : ''}`}
                    >
                      <ElectricBoltIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>Unpaid</li>
                    </div>
                  </div>
                </Link>
                <Link to='/manager/import-electric-number'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div
                      className={`flex items-center gap-[10px] ${path === ImportElectricPath ? 'text-[#1976d3]' : ''}`}
                    >
                      <ElectricBoltIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>Import</li>
                    </div>
                  </div>
                </Link>
              </ul>
            </div>
          </div>

          {/* Water */}
          <div className='relative group'>
            {/* Nút bấm */}
            <div className='flex justify-between w-full h-[50px] pl-[40px] pr-[40px] cursor-pointer hover:bg-[#333]/10'>
              <div
                className={`flex items-center gap-[10px] ${path === ListWaterPath || path === ListWaterUnpaidPath || path === ImportWaterPath ? 'text-[#1976d3]' : ''}`}
              >
                <WaterDropTwoToneIcon />
              </div>
            </div>

            {/* Hover Menu */}
            <div className='absolute w-[200px] border-2 border-[#d1d5dc] rounded-[5px] bg-white shadow-md top-[0] left-[105px] hidden group-hover:block z-[9999]'>
              <ul>
                <Link to='/manager/list-water'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div className={`flex items-center gap-[10px] ${path === ListWaterPath ? 'text-[#1976d3]' : ''}`}>
                      <WaterDropTwoToneIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>List Electric</li>
                    </div>
                  </div>
                </Link>
                <Link to='/manager/import-water-unpaid'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div
                      className={`flex items-center gap-[10px] ${path === ListWaterUnpaidPath ? 'text-[#1976d3]' : ''}`}
                    >
                      <WaterDropTwoToneIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>Unpaid</li>
                    </div>
                  </div>
                </Link>
                <Link to='/manager/import-water-number'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div className={`flex items-center gap-[10px] ${path === ImportWaterPath ? 'text-[#1976d3]' : ''}`}>
                      <WaterDropTwoToneIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>Import</li>
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
                <Link to='/manager/history-notification'>
                  <div className='flex justify-between h-[50px] pl-[20px] pr-[20px] cursor-pointer hover:bg-[#333]/10'>
                    <div
                      className={`flex items-center gap-[10px] ${path === HistoryNotificationPath ? 'text-[#1976d3]' : ''}`}
                    >
                      <AssignmentTwoToneIcon />
                      <li className='flex items-center h-[30px] pl-[10px] '>History Notify</li>
                    </div>
                  </div>
                </Link>
                <Link to='/manager/add-notification'>
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
