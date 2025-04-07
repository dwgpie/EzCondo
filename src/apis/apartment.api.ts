import http from '~/utils/http'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

export const getAllApartment = () => {
  return http.get('/api/Apartment/get-all-apartment')
}

export const addApartment = async (body: { apartmentNumber: string; acreage: number; description: string }) => {
  try {
    const response = await http.post('/api/Apartment/add-apartment', body)
    return response
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 400) {
        toast.error('Apartment Number already exists')
        throw new Error('Apartment Number already exists')
      }
      toast.error('Something went wrong. Please try again!')
      throw new Error(error.response.data?.message || 'Something went wrong')
    }

    toast.error('Unexpected error. Please try again later!')
    throw new Error('Unexpected error')
  }
}

export const editApartment = (body: { id: string; acreage: number; description: string }) =>
  http.patch('/api/Apartment/update-apartment', body)

export const getApartmentById = (apartmentId: string) =>
  http.get(`/api/Apartment/get-apartment-by-id?apartmentId=${apartmentId}`)

export const getApartmentByStatus = () => http.get(`/api/Apartment/get-all-apartment?status=false`)
