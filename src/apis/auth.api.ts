import { AuthRespone } from '~/types/auth.type'
import http from '~/utils/http'

// Auth
export const login = (body: { email: string; password: string }) => http.post<AuthRespone>('/api/Auth/login', body)

export const registerAccount = (body: {
  fullName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  roleName: string
  apartmentNumber: string
}) => http.post('/api/User/add-user', body)

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

  return http.post('/api/Citizen/add-or-update-citizen', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// Admin
export const getAllUser = () => {
  return http.get('/api/User/get-all-users')
}

export const deleteUser = (userId: string) => http.delete(`/api/User/delete-user-by-id?userId=${userId}`)

export const getUserById = (userId: string) => http.get(`/api/User/get-user-by-id?userId=${userId}`)

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
}) => http.patch('/api/User/update-user', body)

//Password
export const forgotPassword = (body: { email: string }) => http.post('/api/Auth/forgot-password', body)

export const verifyOTP = (body: { email: string; code: string }) => http.post(`/api/Auth/verify-otp`, body)

export const resetPassword = (body: { tokenMemory: string; newPassword: string }) =>
  http.post('/api/Auth/reset-password', body)

//Search
export const searchUser = (search: string) => {
  return http.get(`/api/User/get-all-users?search=${search}`)
}

export const searchService = (search: string) => {
  return http.get(`/api/Services/get-all-services?serviceName=${search}`)
}

//Service
export const addService = (body: {
  serviceName: string
  description: string
  typeOfMonth: boolean
  typeOfYear: boolean
  priceOfMonth: number
  priceOfYear: number
}) => http.post('/api/Services/add-or-update-service', body)

export const editService = (body: {
  id: string
  status: string
  serviceName: string
  description: string
  typeOfMonth: boolean
  typeOfYear: boolean
  priceOfMonth: number
  priceOfYear: number
}) => http.post('/api/Services/add-or-update-service', body)

export const addOrUpdateImage = (body: { service_Id: string; serviceImages: File[] }) => {
  const formData = new FormData()
  formData.append('service_Id', body.service_Id)

  // Lặp qua từng ảnh và thêm vào FormData
  body.serviceImages.forEach((image) => {
    formData.append('serviceImages', image) // 'ServiceImages' là key mà backend mong đợi
  })

  console.log('formData:', formData)

  return http.post('/api/Services/add-or-update-service-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getAllService = () => {
  return http.get('/api/Services/get-all-services')
}

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

//Fees
export const addElectric = (body: { minKWh: number; maxKWh: number; pricePerKWh: number }) =>
  http.post('/api/SettingFee/add-or-update-electric-price', body)

export const addWater = (body: { pricePerM3: number }) => http.post('/api/SettingFee/add-water-price', body)

export const addParking = (body: { pricePerMotor: number; pricePerOto: number }) =>
  http.post('/api/SettingFee/add-parking-price', body)

export const getElectric = () => {
  return http.get('/api/SettingFee/get-electric-price')
}

export const getWater = () => {
  return http.get('/api/SettingFee/get-water-price')
}

export const getParking = () => {
  return http.get('/api/SettingFee/get-parking-price')
}

export const editElectric = (body: { id: string; minKWh: number; maxKWh: number; pricePerKWh: number }) =>
  http.post('/api/SettingFee/add-or-update-electric-price', body)

export const editWater = (body: { id: string; pricePerM3: number }) =>
  http.patch('/api/SettingFee/update-water-price', body)

export const editParking = (body: { id: string; pricePerMotor: number; pricePerOto: number }) =>
  http.patch('/api/SettingFee/update-parking-price', body)

//Notification
export const addNotification = (body: { title: string; content: string; receiver: string; type: string }) =>
  http.post('/api/Notification/create-notification', body)

export const addNotificationImages = (body: { NotificationId: string; Image: File[] }) => {
  const formData = new FormData()
  formData.append('NotificationId', body.NotificationId)
  // Lặp qua từng ảnh và thêm vào FormData
  body.Image.forEach((Image) => {
    formData.append('Image', Image)
  })
  return http.post('/api/Notification/create-notification-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// /api/Notification/admin-or-manager-get-notifications?type=&receiver=&page=1&pageSize=10&day=7

export const filterNotification = (body: { type: string; receiver: string; day: number }) => {
  return http.get(
    `/api/Notification/admin-or-manager-get-notifications?type=${body.type}&receiver=${body.receiver}&day=${body.day}`
  )
}

//Apartment
export const getAllApartment = () => {
  return http.get('/api/Apartment/get-all-apartment')
}

export const addApartment = (body: { apartmentNumber: string; acreage: number; description: string }) =>
  http.post('/api/Apartment/add-apartment', body)

export const editApartment = (body: { id: string; acreage: number; description: string }) =>
  http.patch('/api/Apartment/update-apartment', body)

export const getApartmentById = (apartmentId: string) =>
  http.get(`/api/Apartment/get-apartment-by-id?apartmentId=${apartmentId}`)
