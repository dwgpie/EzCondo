import { AuthRespone } from '~/types/auth.type'
import http from '~/utils/http'

export const login = (body: { email: string; password: string }) => http.post<AuthRespone>('/api/Auth/Login', body)

export const registerAccount = (body: {
  fullName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  roleName: string
  apartmentNumber: string
}) => http.post('/api/Admin/Add-User', body)

export const addOrUpdateCitizen = (body: {
  userId: string
  no: string
  dateOfIssue: string
  dateOfExpiry: string
  frontImage: File
  backImage: File
}) => {
  const formData = new FormData()
  formData.append('UserId', body.userId)
  formData.append('No', body.no)
  formData.append('DateOfIssue', body.dateOfIssue)
  formData.append('DateOfExpiry', body.dateOfExpiry)
  formData.append('FrontImage', body.frontImage)
  formData.append('BackImage', body.backImage)

  return http.post('/api/Admin/Add-Or-Update-Citizen', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getAllUser = () => {
  return http.get('/api/Admin/Get-All-Users')
}

export const forgotPassword = (body: { email: string }) => http.post('/api/Auth/forgot-password', body)

export const resetPassword = (body: { email: string; code: string; newPassword: string }) =>
  http.post('/api/Auth/reset-password', body)
