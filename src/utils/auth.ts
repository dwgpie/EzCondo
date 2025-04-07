export const saveAccessTokenToLocalStorage = (token: string) => {
  localStorage.setItem('token', token)
}

export const clearAccessTokenToLocalStorage = () => {
  localStorage.removeItem('token')
}

export const getAccessTokenFromLocalStorage = () => localStorage.getItem('token') || ''

// Role
export const saveUserRoleToLocalStorage = (role: string) => {
  localStorage.setItem('role', role)
}

export const getUserRoleFromLocalStorage = () => localStorage.getItem('role') || ''

export const clearUserRoleFromLocalStorage = () => {
  localStorage.removeItem('role')
}

// Clear all auth data
export const clearAuthData = () => {
  clearAccessTokenToLocalStorage()
  clearUserRoleFromLocalStorage()
}
