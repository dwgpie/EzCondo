import { AuthRespone } from '~/types/auth.type'
import http from '~/utils/http'

export const login = (body: { email: string; password: string }) => http.post<AuthRespone>('/api/Auth/Login', body)

export const registerAccount = (body: {
  fullName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: 'Man' | 'Male' // Cập nhật để khớp với schema
  roleName: 'Admin' | 'Resident'
  apartmentNumber: string
}) => http.post('/api/Admin/Add-User', body)

export const addOrUpdateCitizen = (body: {
  userId: string
  no: string
  dateOfIssue: string // YYYY-MM-DD format
  dateOfExpiry: string // YYYY-MM-DD format
  frontImage: string
  backImage: string
}) => {
  return http.post('/api/Admin/Add-Or-Update-Citizen', body)
}
