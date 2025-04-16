// import { SearchProvider } from './components/Search/SearchContext'
// import useRouteElements from './useRouteElements'
// import { ToastContainer } from 'react-toastify'

// function App() {
//   const routeElements = useRouteElements()
//   return (
//     <SearchProvider>
//       {' '}
//       {/* Bọc toàn bộ ứng dụng */}
//       <div>
//         {routeElements}
//         <ToastContainer />
//       </div>
//     </SearchProvider>
//   )
// }

// export default App

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

    if (!token) {
      if (currentPath !== '/login') {
        navigate('/login')
      }
    } else {
      if (role === 'admin' && !currentPath.startsWith('/admin')) {
        navigate('/admin/dashboard')
      } else if (role === 'manager' && !currentPath.startsWith('/manager')) {
        navigate('/manager/dashboard')
      }
    }
  }, [])

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
