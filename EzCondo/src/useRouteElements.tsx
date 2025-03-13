import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Admin/Dashboard'
import AddUser from './pages/Admin/User/AddUser'
import ListUser from './pages/Admin/User/ListUser'
import FixedFee from './pages/Admin/ManageFee/FixedFee'
import Electricity from './pages/Admin/ManageFee/Electricity'
import { Water } from '@mui/icons-material'
import Service from './pages/Admin/ManageFee/Service/ListService/Service'
import ManageIncident from './pages/SupportTeam/ManageIncident'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import { Outlet, useRoutes, Navigate } from 'react-router-dom'

// function ProtectedRoute() {
//   const { isAuthenticated } = useContext(AppContext) // Lấy từ context
//   console.log('isAuthenticated:', isAuthenticated) // Debug

//   return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
// }

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  // Kiểm tra cả từ localStorage
  const token = localStorage.getItem('token')
  const isUserAuthenticated = isAuthenticated || Boolean(token)
  return isUserAuthenticated ? <Outlet /> : <Navigate to='/login' replace />
}

function RejectedRouted() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '/',
      index: true,
      element: <LandingPage />
    },
    {
      path: '',
      element: <RejectedRouted />,
      children: [
        {
          path: '/login',
          element: <Login />
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/admin/dashboard',
          element: (
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          )
        },
        {
          path: '/admin/add-user',
          element: (
            <DashboardLayout>
              <AddUser />
            </DashboardLayout>
          )
        },
        {
          path: '/admin/list-user',
          element: (
            <DashboardLayout>
              <ListUser />
            </DashboardLayout>
          )
        },
        {
          path: '/admin/fixed-fee',
          element: (
            <DashboardLayout>
              <FixedFee />
            </DashboardLayout>
          )
        },
        {
          path: '/admin/services',
          element: (
            <DashboardLayout>
              <Service />
            </DashboardLayout>
          )
        },
        {
          path: '/admin/electricity',
          element: (
            <DashboardLayout>
              <Electricity />
            </DashboardLayout>
          )
        },
        {
          path: '/admin/water',
          element: (
            <DashboardLayout>
              <Water />
            </DashboardLayout>
          )
        }
      ]
    },
    {
      path: '/support-team/manage-incident',
      element: (
        <DashboardLayout>
          <ManageIncident />
        </DashboardLayout>
      )
    }
  ])
  return routeElements
}
