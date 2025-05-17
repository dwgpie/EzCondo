import http from '~/utils/http'

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
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error)
    } else {
      throw new Error('Something went wrong')
    }
  }
}

export const deleteMember = (id: string) => http.delete(`/api/HouseHoldMember/delete-house-hold-member?id=${id}`)

export const getAllResident = () => {
  return http.get('/api/User/get-all-users?roleName=resident')
}

export const searchResident = (search: string) => {
  return http.get(`/api/User/get-all-users?roleName=resident&search=${search}`)
}

export const getAllHouseHoldMember = () => {
  return http.get('/api/HouseHoldMember/dash-board-members')
}
