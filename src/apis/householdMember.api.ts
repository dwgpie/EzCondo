import http from '~/utils/http'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

export const getHouseholdMember = (apartmentNumber: string) => {
  return http.get(`/api/HouseHoldMember/get-house-hold-member-by-apartment-number?apartmentNumber=${apartmentNumber}`)
}

export const addOrUpdateMember = async (body: {
  apartmentNumber: string
  no: string
  fullName: string
  dateOfBirth: string
  gender: string
  phoneNumber: string
  relationship: string
}) => {
  try {
    const response = await http.post('/api/HouseHoldMember/add-or-update-house-hold-member', body)
    return response.data
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 400) {
        toast.error('Phone number or Citizen Identity Number already exists')
        throw new Error('Phone number or Citizen Identity Number already exists')
      }
      toast.error('Something went wrong. Please try again!')
      throw new Error(error.response.data?.message || 'Something went wrong')
    }

    toast.error('Unexpected error. Please try again later!')
    throw new Error('Unexpected error')
  }
}

export const deleteMember = (id: string) => http.delete(`/api/HouseHoldMember/delete-house-hold-member?id=${id}`)
