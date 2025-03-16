export const saveAccessTokenToLocalStorage = (token: string) => {
  localStorage.setItem('token', token)
}

export const clearAccessTokenToLocalStorage = () => {
  localStorage.removeItem('token')
}

export const getAccessTokenFromLocalStorage = () => localStorage.getItem('token') || ''
