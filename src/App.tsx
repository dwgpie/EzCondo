import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { SearchProvider } from './components/Search/SearchContext'
import useRouteElements from './useRouteElements'
import { getAccessTokenFromLocalStorage, getUserRoleFromLocalStorage } from './utils/auth'

function App() {
  const routeElements = useRouteElements()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = getAccessTokenFromLocalStorage()
    const role = getUserRoleFromLocalStorage()
    const currentPath = location.pathname

    const isPublicPath = ['/', '/login', '/forgot-password', '/reset-password', '/verify-otp'].includes(currentPath)

    if (!token) {
      if (!isPublicPath) {
        navigate('/login')
      }
    } else {
      if (role === 'admin' && currentPath === '/') {
        navigate('/admin/dashboard')
      } else if (role === 'manager' && currentPath === '/') {
        navigate('/manager/dashboard')
      }
    }
  }, [location.pathname, navigate])

  return (
    <SearchProvider>
      <div>
        {routeElements}
        <ToastContainer />
      </div>
    </SearchProvider>
  )
}

export default App
