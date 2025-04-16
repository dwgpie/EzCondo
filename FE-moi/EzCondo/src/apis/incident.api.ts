import http from '~/utils/http'

export const getAllIncident = () => {
  return http.get('/api/Incident/get-all-incident')
}

// export const deleteUser = (userId: string) => http.delete(`/api/User/delete-user-by-id?userId=${userId}`)

// export const getUserById = (userId: string) => http.get(`/api/User/get-user-by-id?userId=${userId}`)

// export const editUser = (body: {
//   id: string
//   fullName: string
//   email: string
//   phoneNumber: string
//   dateOfBirth: string
//   gender: string
//   roleName: string
//   apartmentNumber: string
//   status: string
// }) => http.patch('/api/User/update-user', body)
