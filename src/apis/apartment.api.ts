import http from '~/utils/http'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

export const getAllApartment = () => {
  return http.get('/api/Apartment/get-all-apartment')
}

export const addApartment = (body: { apartmentNumber: string; acreage: number; description: string }) =>
  http.post('/api/Apartment/add-apartment', body)

export const editApartment = (body: { id: string; acreage: number; description: string }) =>
  http.patch('/api/Apartment/update-apartment', body)

export const getApartmentById = (apartmentId: string) =>
  http.get(`/api/Apartment/get-apartment-by-id?apartmentId=${apartmentId}`)
