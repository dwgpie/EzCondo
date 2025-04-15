import http from '~/utils/http'

export const getHouseholdMember = (apartmentNumber: string) => {
  return http.get(`/api/HouseHoldMember/get-house-hold-member-by-apartment-number?apartmentNumber=${apartmentNumber}`)
}

export const addOrUpdateMember = (body: {
  id: string | null
  apartmentNumber: string
  no: string
  fullName: string
  dateOfBirth: string
  gender: string
  phoneNumber: string
  relationship: string
}) => http.post('/api/HouseHoldMember/add-or-update-house-hold-member', body)

export const deleteMember = (id: string) => http.delete(`/api/HouseHoldMember/delete-house-hold-member?id=${id}`)
