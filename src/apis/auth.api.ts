// import { AuthRespone } from '~/types/auth.type'
import http from '~/utils/http'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

// Auth
// export const login = (body: { email: string; password: string }) => http.post<AuthRespone>('/api/Auth/login', body)

export const login = async (body: { email: string; password: string }) => {
  try {
    const response = await http.post('/api/Auth/login', body)
    return response.data
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 401) {
        toast.error('Incorrect password')
        throw new Error('Incorrect password')
      }

      if (error.response.status === 404) {
        toast.error('User not found')
        throw new Error('User not found')
      }

      if (error.response.status === 423) {
        toast.error('Your account is blocked')
        throw new Error('Your account is blocked')
      }

      toast.error('Something went wrong', {
        style: { width: 'fit-content' }
      })
      throw new Error(error.response.data?.message || 'Something went wrong')
    }
  }
}

export const registerAccount = async (body: {
  fullName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  roleName: string
  apartmentNumber: string
}) => {
  try {
    const response = await http.post('/api/User/add-user', body)
    return response.data
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error)
    } else {
      throw new Error('Something went wrong')
    }
  }
}

//Password
export const forgotPassword = (body: { email: string }) => http.post('/api/Auth/forgot-password', body)

export const verifyOTP = (body: { email: string; code: string }) => http.post(`/api/Auth/verify-otp`, body)

export const resetPassword = (body: { tokenMemory: string; newPassword: string }) =>
  http.post('/api/Auth/reset-password', body)

//Search
export const searchUser = (search: string) => {
  return http.get(`/api/User/get-all-users?search=${search}`)
}

//Profile
export const getProfile = () => {
  return http.get('/api/User/get-infor-me')
}

export const updateProfile = (body: { fullName: string; phoneNumber: string; dateOfBirth: string; gender: string }) =>
  http.patch('/api/User/edit-infor-me', body)

export const addOrUpdateAvatar = (avatar: File) => {
  const formData = new FormData()
  formData.append('avatar', avatar)

  return http.post('/api/User/add-or-update-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const changePassword = (body: { oldPassword: string; newPassword: string }) =>
  http.patch('/api/User/change-password', body)
