import http from '~/utils/http'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

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
    formData.append('serviceImages', image)
  })

  return http.post('/api/Services/add-or-update-service-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  // return http.post('/api/Services/add-or-update-service-images', body)
}

export const getAllService = () => {
  return http.get('/api/Services/get-all-services')
}

export const getServiceById = (serviceId: string) => http.get(`/api/Services/get-service-by-id?serviceId=${serviceId}`)

export const getImageById = (serviceId: string) => http.get(`/api/Services/get-service-images?serviceId=${serviceId}`)

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

export const deleteElectric = (electricId: string) =>
  http.delete(`/api/SettingFee/delete-electric-price?electricId=${electricId}`)
