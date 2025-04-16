import Login from './pages/Login'
// import LandingPage from './pages/LandingPage'
import DashboardLayout from './layouts/DashboardAdminLayout'
import DashboardManagerLayout from './layouts/DashboardManagerLayout'
import Dashboard from './pages/Admin/Dashboard'
import AddUser from './pages/Admin/User/AddUser'
import ListUser from './pages/Admin/User/ListUser'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import { Outlet, useRoutes, Navigate } from 'react-router-dom'
import ForgotPassword from './pages/Password/ForgotPassword'
import ResetPassword from './pages/Password/ResetPassword'
import EditUser from './pages/Admin/User/EditUser'
import AddService from './pages/Admin/ManageFee/Service/AddService'
import ListService from './pages/Admin/ManageFee/Service/ListService/ListService'
import Profile from './pages/Profile'
import EditService from './pages/Admin/ManageFee/Service/EditService'
import ChangePassword from './pages/Password/ChangePassword'
import Electricity from './pages/Admin/ManageFee/Electricity'
import Parking from './pages/Admin/ManageFee/Parking'
import VerifyOTP from './pages/Password/VerifyOTP'
import Water from './pages/Admin/ManageFee/Water'
import AddApartment from './pages/Admin/Apartment/AddAparment'
import ListApartment from './pages/Admin/Apartment/ListApartment'
import AddNotification from './pages/Admin/Notification/AddNotification'
import HistoryNotification from './pages/Admin/Notification/HistoryNotification'
import ListResident from './pages/Manager/Resident/ListResident'
import DetailResident from './pages/Manager/Resident/Detail'
import AddNotificationManager from './pages/Manager/Notification/AddNotification'
import HistoryNotificationManager from './pages/Manager/Notification/HistoryNotification'
import AddMember from './pages/Manager/Resident/AddMember'
import ListIncident from './pages/Manager/Incident/ListIncident'

// function ProtectedRoute() {
//   const { isAuthenticated } = useContext(AppContext) // Lấy từ context
//   console.log('isAuthenticated:', isAuthenticated) // Debug

//   return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
// }

// function ProtectedRoute() {
//   const { isAuthenticated } = useContext(AppContext)
//   // Kiểm tra cả từ localStorage
//   const token = localStorage.getItem('token')
//   const isUserAuthenticated = isAuthenticated || Boolean(token)
//   return isUserAuthenticated ? <Outlet /> : <Navigate to='/login' replace />
// }

// function RejectedRouted() {
//   const { isAuthenticated } = useContext(AppContext)
//   return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
// }

function ProtectedRoute() {
  const { isAuthenticated, userRole } = useContext(AppContext)
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role') || userRole

  const isUserAuthenticated = isAuthenticated || Boolean(token)
  if (!isUserAuthenticated) return <Navigate to='/login' replace />
  if (!role) return <Navigate to='/login' replace />
  return isUserAuthenticated ? <Outlet /> : <Navigate to='/login' replace />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}
export default function useRouteElements() {
  const { userRole } = useContext(AppContext)

  const routeElements = useRoutes([
    // Public / Login routes
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        { path: '/login', element: <Login /> },
        { path: '/forgot-password', element: <ForgotPassword /> },
        { path: '/verify-otp', element: <VerifyOTP /> },
        { path: '/reset-password', element: <ResetPassword /> }
      ]
    },

    // Protected routes
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        ...(userRole === 'admin'
          ? [
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
                path: '/admin/edit-user',
                element: (
                  <DashboardLayout>
                    <EditUser />
                  </DashboardLayout>
                )
              },
              {
                path: '/admin/setting-fee-electricity',
                element: (
                  <DashboardLayout>
                    <Electricity />
                  </DashboardLayout>
                )
              },
              {
                path: '/admin/setting-fee-water',
                element: (
                  <DashboardLayout>
                    <Water />
                  </DashboardLayout>
                )
              },
              {
                path: '/admin/setting-fee-parking',
                element: (
                  <DashboardLayout>
                    <Parking />
                  </DashboardLayout>
                )
              },
              {
                path: '/admin/list-service',
                element: (
                  <DashboardLayout>
                    <ListService />
                  </DashboardLayout>
                )
              },
              {
                path: '/admin/add-service',
                element: (
                  <DashboardLayout>
                    <AddService />
                  </DashboardLayout>
                )
              },
              {
                path: '/admin/edit-service',
                element: (
                  <DashboardLayout>
                    <EditService />
                  </DashboardLayout>
                )
              },
              {
                path: '/admin/history-notification',
                element: (
                  <DashboardLayout>
                    <HistoryNotification />
                  </DashboardLayout>
                )
              },
              {
                path: '/admin/add-notification',
                element: (
                  <DashboardLayout>
                    <AddNotification />
                  </DashboardLayout>
                )
              },
              {
                path: '/admin/add-apartment',
                element: (
                  <DashboardLayout>
                    <AddApartment />
                  </DashboardLayout>
                )
              },
              {
                path: '/admin/list-apartment',
                element: (
                  <DashboardLayout>
                    <ListApartment />
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
          : []),
        ...(userRole === 'manager'
          ? [
              {
                path: '/manager/dashboard',
                element: (
                  <DashboardManagerLayout>
                    <Dashboard />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/list-resident',
                element: (
                  <DashboardManagerLayout>
                    <ListResident />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/detail-resident',
                element: (
                  <DashboardManagerLayout>
                    <DetailResident />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/add-member',
                element: (
                  <DashboardManagerLayout>
                    <AddMember />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/add-notification',
                element: (
                  <DashboardManagerLayout>
                    <AddNotificationManager />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/history-notification',
                element: (
                  <DashboardManagerLayout>
                    <HistoryNotificationManager />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/list-incident',
                element: (
                  <DashboardManagerLayout>
                    <ListIncident />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/profile',
                element: (
                  <DashboardManagerLayout>
                    <Profile />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/change-password',
                element: (
                  <DashboardManagerLayout>
                    <ChangePassword />
                  </DashboardManagerLayout>
                )
              }
            ]
          : [])
      ]
    }
  ])

  return routeElements
}
