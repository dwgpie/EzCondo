import { useRoutes } from 'react-router-dom'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import LoginLayout from './layouts/LoginLayout/LoginLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Admin/Dashboard'
import AddUser from './pages/Admin/User/AddUser'
import ListUser from './pages/Admin/User/ListUser'
import FixedFee from './pages/Admin/ManageFee/FixedFee'
import Electricity from './pages/Admin/ManageFee/Electricity'
import { Water } from '@mui/icons-material'
import Service from './pages/Admin/ManageFee/Service/ListService/Service'
import ManageIncident from './pages/SupportTeam/ManageIncident'

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: <LandingPage />
    },
    {
      path: '/login',
      element: (
        <LoginLayout>
          <Login />
        </LoginLayout>
      )
    },
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
