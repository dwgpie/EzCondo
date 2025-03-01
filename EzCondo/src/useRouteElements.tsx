import { useRoutes } from 'react-router-dom'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import LoginLayout from './layouts/LoginLayout/LoginLayout'

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
    }
  ])
  return routeElements
}
