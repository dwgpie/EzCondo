import { AuthRespone } from '~/types/auth.type'
import http from '~/utils/http'

// Auth
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

// Citizen
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

// Admin
export const getAllUser = () => {
  return http.get('/api/Admin/Get-All-Users')
}

export const deleteUser = (userId: string) => http.delete(`/api/Admin/delete-user-by-id?userId=${userId}`)

export const getUserById = (userId: string) => http.get(`/api/Admin/get-user-by-id?userId=${userId}`)

export const editUser = (body: {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  roleName: string
  apartmentNumber: string
  status: string
}) => http.patch('/api/Admin/update-user', body)

//Password
export const forgotPassword = (body: { email: string }) => http.post('/api/Auth/forgot-password', body)

export const resetPassword = (body: { email: string; code: string; newPassword: string }) =>
  http.post('/api/Auth/reset-password', body)

//Search
export const searchUser = (search: string) => {
  return http.get(`/api/Admin/get-all-users?search=${search}`)
}

//Service
export const addService = (body: {
  serviceName: string
  description: string
  typeOfMonth: boolean
  typeOfYear: boolean
  priceOfMonth: number
  priceOfYear: number
}) => http.post('/api/Admin/add-or-update-service', body)

export const editService = (body: {
  id: string
  status: string
  serviceName: string
  description: string
  typeOfMonth: boolean
  typeOfYear: boolean
  priceOfMonth: number
  priceOfYear: number
}) => http.post('/api/Admin/add-or-update-service', body)

export const addOrUpdateImage = (body: { service_Id: string; serviceImages: File[] }) => {
  const formData = new FormData()
  formData.append('service_Id', body.service_Id)

  // Lặp qua từng ảnh và thêm vào FormData
  body.serviceImages.forEach((image) => {
    formData.append('serviceImages', image) // 'ServiceImages' là key mà backend mong đợi
  })

  console.log('formData:', formData)

  return http.post('/api/Admin/add-or-update-service-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getAllService = () => {
  return http.get('/api/Services/get-all-services')
}

export const getServiceByIdImage = (serviceId: string) =>
  http.get(`/api/Services/get-service-images?serviceId=${serviceId}`)

export const getServiceById = (serviceId: string) => http.get(`/api/Services/get-service-by-id?serviceId=${serviceId}`)

export const getImageById = (serviceId: string) => http.get(`/api/Services/get-service-images?serviceId=${serviceId}`)

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
