const TOKEN_KEY = 'token'
const ROLE_KEY = 'role'

// Kiểm tra nếu role được phép lưu vào localStorage
const isRoleAllowedToStore = (role: string) => {
  return role !== 'resident'
}

// Token
export const saveAccessTokenToLocalStorage = (token: string, role: string) => {
  if (!isRoleAllowedToStore(role)) {
    return
  }
  localStorage.setItem(TOKEN_KEY, token)
}

export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export const clearAccessTokenFromLocalStorage = () => {
  localStorage.removeItem(TOKEN_KEY)
}

// Role
export const saveUserRoleToLocalStorage = (role: string) => {
  if (!isRoleAllowedToStore(role)) return
  localStorage.setItem(ROLE_KEY, role)
}

export const getUserRoleFromLocalStorage = () => {
  return localStorage.getItem(ROLE_KEY) || ''
}

export const clearUserRoleFromLocalStorage = () => {
  localStorage.removeItem(ROLE_KEY)
}

// Clear all auth data
export const clearAuthData = () => {
  clearAccessTokenFromLocalStorage()
  clearUserRoleFromLocalStorage()
}
