import Login from './pages/Login'
import DashboardLayout from './layouts/DashboardAdminLayout'
import DashboardManagerLayout from './layouts/DashboardManagerLayout'
import Dashboard from './pages/Admin/Dashboard'
import AddUser from './pages/Admin/User/AddUser'
import ListUser from './pages/Admin/User/ListUser'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import { useRoutes } from 'react-router-dom'
import { ProtectedRoute, RejectedRoute } from './components/ProtectedRoutes'
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
import ElectricityMeter from './pages/Manager/Electricity/ElectricityMeter'
import ElectricityReading from './pages/Manager/Electricity/ElectricityReading'
import ElectricityDetail from './pages/Manager/Electricity/ElectricityDetail'
import DashboardManager from './pages/Manager/Dashboard'
import UnpaidElectricity from './pages/Manager/Electricity/UnpaidElectricity'
import WaterMeter from './pages/Manager/Water/WaterMeter'
import WaterReading from './pages/Manager/Water/WaterReading'
import WaterDetail from './pages/Manager/Water/WaterDetail'
import UnpaidWater from './pages/Manager/Water/UnpaidWater'
import LandingPage from './pages/LandingPage'
import PageNotFound from './pages/PageNotFound'
import UpdateIncident from './pages/Manager/Incident/UpdateIncident'
import Demo from './pages/Demo'
import RequestParking from './pages/Manager/Parking/RequestParking'
import ListParking from './pages/Manager/Parking/ListParking'
import DetailParking from './pages/Manager/Parking/DetailParking'
import BookingHistory from './pages/Manager/BookingHistory'
import PaymentHistory from './pages/Manager/PaymentHistory'
import UnpaidParking from './pages/Manager/Parking/UnpaidParking'
import AddGeneralService from './pages/Admin/GeneralService/AddGeneralService'
import ListGeneralService from './pages/Admin/GeneralService/ListGeneralService'

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
        { path: '/reset-password', element: <ResetPassword /> },
        {
          path: '/',
          element: <LandingPage />
        }
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
                path: '/admin/add-general-service',
                element: (
                  <DashboardLayout>
                    <AddGeneralService />
                  </DashboardLayout>
                )
              },
              {
                path: '/admin/list-general-service',
                element: (
                  <DashboardLayout>
                    <ListGeneralService />
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
                    <DashboardManager />
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
                path: '/manager/update-incident',
                element: (
                  <DashboardManagerLayout>
                    <UpdateIncident />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/add-electricity-meter',
                element: (
                  <DashboardManagerLayout>
                    <ElectricityMeter />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/add-electricity-reading',
                element: (
                  <DashboardManagerLayout>
                    <ElectricityReading />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/electricity-detail',
                element: (
                  <DashboardManagerLayout>
                    <ElectricityDetail />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/unpaid-electricity',
                element: (
                  <DashboardManagerLayout>
                    <UnpaidElectricity />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/add-water-meter',
                element: (
                  <DashboardManagerLayout>
                    <WaterMeter />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/add-water-reading',
                element: (
                  <DashboardManagerLayout>
                    <WaterReading />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/water-detail',
                element: (
                  <DashboardManagerLayout>
                    <WaterDetail />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/unpaid-water',
                element: (
                  <DashboardManagerLayout>
                    <UnpaidWater />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/request-parking',
                element: (
                  <DashboardManagerLayout>
                    <RequestParking />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/list-parking',
                element: (
                  <DashboardManagerLayout>
                    <ListParking />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/detail-parking',
                element: (
                  <DashboardManagerLayout>
                    <DetailParking />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/unpaid-parking',
                element: (
                  <DashboardManagerLayout>
                    <UnpaidParking />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/booking-history',
                element: (
                  <DashboardManagerLayout>
                    <BookingHistory />
                  </DashboardManagerLayout>
                )
              },
              {
                path: '/manager/payment-history',
                element: (
                  <DashboardManagerLayout>
                    <PaymentHistory />
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
              },
              {
                path: '/demo',
                element: (
                  <DashboardManagerLayout>
                    <Demo />
                  </DashboardManagerLayout>
                )
              }
            ]
          : [])
      ]
    },

    { path: '*', element: <PageNotFound /> }
  ])

  return routeElements
}
