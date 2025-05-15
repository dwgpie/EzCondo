import http from '~/utils/http'
import { AxiosError } from 'axios'

export const searchService = (search: string) => {
  return http.get(`/api/Services/get-all-services?serviceName=${search}`)
}

const API_BASE_URL = import.meta.env.VITE_API_URL

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
        throw new Error('water_create_error')
      }
      throw new Error('something_went_wrong')
    }
    throw error
  }
}

export const addParking = async (body: { pricePerMotor: number; pricePerOto: number }) => {
  try {
    const response = await http.post('/api/SettingFee/add-parking-price', body)
    return response
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 409) {
        throw new Error('parking_create_error')
      }
      throw new Error('something_went_wrong')
    }
    throw error
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

export const getAllElectricityReading = () => http.get('/api/Electric/Get-All-Electric-Readings')

//Manager
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
        throw new Error('apartment_fail')
      }
      if (status === 409) {
        throw new Error('invalid_date')
      }
      throw new Error('something_went_wrong')
    }
    throw error
  }
}

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
        throw new Error('apartment_fail')
      }
      if (status === 409) {
        throw new Error('apartment_not_user')
      }
      if (status === 500) {
        throw new Error('electricity_reading_low')
      }
      throw new Error('something_went_wrong')
    }
    throw error
  }
}

export const getAllElectricityMeter = () => http.get('/api/Electric/Get-All-Electric-Metters')

export const getAllElectric = () => http.get('/api/Electric/Get-All-Electric')

export const getElectricDetail = (electricId: string) => {
  return http.get(`/api/Electric/Get-Electric-Detail?electricId=${electricId}`)
}

export const dowloadTemplateElectricMeter = () => {
  return http.get(`${API_BASE_URL}/api/Electric/Download-Template-Electric-Metter`, {
    responseType: 'blob'
  })
}

export const dowloadTemplateElectricReading = () => {
  return http.get(`${API_BASE_URL}/api/Electric/Download-Template-Electric-Reading`, {
    responseType: 'blob'
  })
}

export const addWaterMeter = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await http.post('/api/Water/Add-Water-Metter', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status
        if (status === 404) {
          throw new Error('apartment_fail')
        }
        if (status === 409) {
          throw new Error('invalid_date')
        }
        throw new Error('something_went_wrong')
      }
      throw error
    }
  }
}

export const addWaterReading = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await http.post('/api/Water/Add-Water-Reading', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status
      if (status === 404) {
        throw new Error('apartment_fail')
      }
      if (status === 409) {
        throw new Error('apartment_not_user')
      }
      if (status === 500) {
        throw new Error('water_reading_low')
      }
      throw new Error('something_went_wrong')
    }
    throw error
  }
}

export const getAllWaterMeter = () => http.get('/api/Water/Get-All-Water-Metters')

export const getAllWater = () => http.get('/api/Water/Get-All-Water')

export const getWaterDetail = (waterReadingId: string) => {
  return http.get(`/api/Water/Get-Water-Detail?waterReadingId=${waterReadingId}`)
}

export const dowloadTemplateWaterMeter = () => {
  return http.get(`${API_BASE_URL}/api/Water/Download-Template-Water-Metter`, {
    responseType: 'blob'
  })
}

export const dowloadTemplateWaterReading = () => {
  return http.get(`${API_BASE_URL}/api/Water/Download-Template-Water-Reading`, {
    responseType: 'blob'
  })
}

export const filterElectric = (body: { status: string; day: string; month: string }) => {
  return http.get(`/api/Electric/Get-All-Electric?status=${body.status}&day=${body.day}&month=${body.month}`)
}

export const filterElectricDashboard = (body: { status: string; month: string }) => {
  return http.get(`/api/Electric/Get-All-Electric?status=${body.status}&month=${body.month}`)
}

export const updateBillElectric = (body: { electricBillId: string }[]) => {
  return http.patch('/api/Electric/Update-Electric-Bill', body)
}

export const filterWater = (body: { status: string; day: string; month: string }) => {
  return http.get(`/api/Water/Get-All-Water?status=${body.status}&day=${body.day}&month=${body.month}`)
}

export const filterWaterDashboard = (body: { status: string; month: string }) => {
  return http.get(`/api/Water/Get-All-Water?status=${body.status}&month=${body.month}`)
}

export const updateBillWater = (body: { waterBillId: string }[]) => {
  return http.patch('/api/Water/Update-Water-Bill', body)
}

//Parking
export const getAllParkingLot = () => {
  return http.get('/api/ParkingLot/Get-All-Parking-Lot')
}

export const getAllParkingRequest = () => {
  return http.get('api/ParkingLot/Get-All-Parking-Lot-Request')
}
export const getAllParking = () => {
  return http.get('/api/ParkingLot/Get-All-Parking')
}

export const getAllParkingUnpaid = (body: { status: string; day: string; month: string }) => {
  return http.get(`/api/ParkingLot/Get-All-Parking?status=${body.status}&day=${body.day}&month=${body.month}`)
}

export const getParkingById = (parkingLotId: string) => {
  return http.get(`/api/ParkingLot/Get-Parking-Lot-Detail?parkingLotId=${parkingLotId}`)
}

export const acceptParking = (body: { parkingLotId: string; accept: boolean }) => {
  return http.post('/api/ParkingLot/Accept-Or-Reject-Parking-Lot', body)
}

export const updateParkingLot = (body: { parkingLotDetailId: string; status: boolean; checking: boolean }) => {
  return http.patch('/api/ParkingLot/Update-Parking-Lot-Detail', body)
}

export const deleteParkingLot = (parkingLotDetailId: string) => {
  return http.delete(`/api/ParkingLot/Delete-Parking-Lot-Detail?parkingLotDetailId=${parkingLotDetailId}`)
}

//Booking
export const getAllBooking = (search: string, month: string) => {
  return http.get(`/api/Booking/Get-All-Booking?search=${search}&month=${month}`)
}

export const getAllBookingSearch = (search: string) => {
  return http.get(`/api/Booking/Get-All-Booking?search=${search}`)
}

export const getAllBookingDashboard = (month: string) => {
  return http.get(`/api/Booking/Get-All-Booking?month=${month}`)
}

//Payment
export const getAllPayment = (month: string) => {
  return http.get(`/api/Payment/History-Payment?month=${month}`)
}

export const getAllPaymentSearch = (search: string) => {
  return http.get(`/api/Payment/History-Payment?search=${search}`)
}
