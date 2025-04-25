import http from '~/utils/http'

//User
export const searchUser = (search: string) => {
  return http.get(`/api/User/get-all-users?search=${search}`)
}

export const registerAccount = async (body: {
  fullName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  roleName: string
  apartmentNumber: string
}) => {
  try {
    const response = await http.post('/api/User/add-user', body)
    return response.data
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error)
    } else {
      throw new Error('Something went wrong')
    }
  }
}

export const getAllUser = () => {
  return http.get('/api/User/get-all-users')
}

export const deleteUser = (userId: string) => http.delete(`/api/User/delete-user-by-id?userId=${userId}`)

export const getUserById = (userId: string) => http.get(`/api/User/get-user-by-id?userId=${userId}`)

export const editUser = (body: {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  roleName: string
  apartmentNumber: string
  status: string
}) => http.patch('/api/User/update-user', body)
