import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AppContext } from '../contexts/app.context'

export function ProtectedRoute() {
  const { isAuthenticated, userRole } = useContext(AppContext)
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role') || userRole

  const isUserAuthenticated = isAuthenticated || Boolean(token)
  if (!isUserAuthenticated) return <Navigate to='/login' replace />
  if (!role) return <Navigate to='/login' replace />
  return isUserAuthenticated ? <Outlet /> : <Navigate to='/login' replace />
}

export function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}
