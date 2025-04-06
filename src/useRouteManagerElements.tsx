import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import DashboardLayout from './layouts/DashboardManagerLayout'
import Dashboard from './pages/Manager/Dashboard'
import AddUser from './pages/Admin/User/AddUser'
import ListResident from './pages/Manager/Resident/ListResident'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import { Outlet, useRoutes, Navigate } from 'react-router-dom'
import ForgotPassword from './pages/Password/ForgotPassword'
import ResetPassword from './pages/Password/ResetPassword'
import DetailResident from './pages/Manager/Resident/Detail'
import AddMember from './pages/Manager/Resident/AddMember'
import Profile from './pages/Profile'
import ChangePassword from './pages/Password/ChangePassword'
import VerifyOTP from './pages/Password/VerifyOTP'

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
        },
        {
          path: '/forgot-password',
          element: <ForgotPassword />
        },
        {
          path: '/verify-otp',
          element: <VerifyOTP />
        },
        {
          path: '/reset-password',
          element: <ResetPassword />
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/manager/dashboard',
          element: (
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          )
        },
        {
          path: '/manager/list-resident',
          element: (
            <DashboardLayout>
              <ListResident />
            </DashboardLayout>
          )
        },
        {
          path: '/manager/detail-resident',
          element: (
            <DashboardLayout>
              <DetailResident />
            </DashboardLayout>
          )
        },
        {
          path: '/manager/add-member',
          element: (
            <DashboardLayout>
              <AddMember />
            </DashboardLayout>
          )
        },
        {
          path: '/profile',
          element: (
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          )
        },
        {
          path: '/change-password',
          element: (
            <DashboardLayout>
              <ChangePassword />
            </DashboardLayout>
          )
        }
      ]
    }
  ])
  return routeElements
}
