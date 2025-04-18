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

export const addWater = async (body: { pricePerM3: number }) => {
  try {
    const response = await http.post('/api/SettingFee/add-water-price', body)
    return response
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 409) {
        toast.error('Water price can only be set once')
        throw new Error('Parking price can only be set once')
      }
      toast.error('Something went wrong. Please try again!')
      throw new Error(error.response.data?.message || 'Something went wrong')
    }

    toast.error('Unexpected error. Please try again later!')
    throw new Error('Unexpected error')
  }
}

export const addParking = async (body: { pricePerMotor: number; pricePerOto: number }) => {
  try {
    const response = await http.post('/api/SettingFee/add-parking-price', body)
    return response
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 409) {
        toast.error('Parking price can only be set once')
        throw new Error('Parking price can only be set once')
      }
      toast.error('Something went wrong. Please try again!')
      throw new Error(error.response.data?.message || 'Something went wrong')
    }

    toast.error('Unexpected error. Please try again later!')
    throw new Error('Unexpected error')
  }
}

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

export const getAllElectricityMeter = () => http.get('/api/Electric/Get-All-Electric-Metters')

export const addElectricityMeter = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await http.post('/api/Electric/Add-Electric-Metters', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status

      if (status === 404) {
        toast.error('Apartment is not found')
        throw new Error('Apartment is not found')
      }

      if (status === 409) {
        toast.error('Invalid date format. Please use dd/MM/yyyy')
        throw new Error('Invalid date format. Please use dd/MM/yyyy')
      }

      toast.error('Something went wrong. Please try again!')
      throw new Error(error.response.data?.message || 'Something went wrong')
    }

    toast.error('Unexpected error. Please try again later!')
    throw new Error('Unexpected error')
  }
}

export const getAllElectricityReading = () => http.get('/api/Electric/Get-All-Electric-Readings')

export const getAllElectric = () => http.get('/api/Electric/Get-All-Electric')

export const addElectricityReading = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await http.post('/api/Electric/Add-Electric-Readings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status

      if (status === 404) {
        toast.error('Apartment is not found')
        throw new Error('Apartment is not found')
      }

      if (status === 409) {
        toast.error('Apartment have no user')
        throw new Error('Apartment have no user')
      }

      toast.error('Something went wrong. Please try again!')
      throw new Error(error.response.data?.message || 'Something went wrong')
    }

    toast.error('Unexpected error. Please try again later!')
    throw new Error('Unexpected error')
  }
}

export const getElectricDetail = (electricId: string) => {
  return http.get(`/api/Electric/Get-Electric-Detail?electricId=${electricId}`)
}
