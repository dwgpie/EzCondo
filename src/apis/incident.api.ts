import http from '~/utils/http'

export const getAllIncident = () => {
  return http.get('/api/Incident/get-all-incident')
}

// export const deleteUser = (userId: string) => http.delete(`/api/User/delete-user-by-id?userId=${userId}`)

// export const getUserById = (userId: string) => http.get(`/api/User/get-user-by-id?userId=${userId}`)

export const updateIncidentStatus = (body: { id: string; status: string }) =>
  http.patch('/api/Incident/update-incident-status', body)
