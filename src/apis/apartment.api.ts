import http from '~/utils/http'
import { AxiosError } from 'axios'

export const getAllApartment = () => {
  return http.get('/api/Apartment/get-all-apartment')
}

export const addApartment = async (body: { apartmentNumber: string; acreage: number; description: string }) => {
  try {
    const response = await http.post('/api/Apartment/add-apartment', body)
    return response
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status
      if (status === 400) {
        throw new Error('apartment_already_exists')
      }
    }
    throw error
  }
}

export const editApartment = (body: { id: string; acreage: number; description: string }) =>
  http.patch('/api/Apartment/update-apartment', body)

export const getApartmentById = (apartmentId: string) =>
  http.get(`/api/Apartment/get-apartment-by-id?apartmentId=${apartmentId}`)

export const getApartmentByStatus = () => http.get(`/api/Apartment/get-all-apartment?status=false`)
export const getApartmentByStatusTrue = () => http.get(`/api/Apartment/get-all-apartment?status=true`)
