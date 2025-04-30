import http from '~/utils/http'

export const getAllIncident = () => {
  return http.get('/api/Incident/get-all-incident')
}

export const getIncidentById = (id: string) => {
  return http.get(`/api/Incident/get-incident-by-id?incidentId=${id}`)
}

export const getImageIncidentById = (id: string) => {
  return http.get(`/api/Incident/get-incident-image-by-incident-id?incidentId=${id}`)
}

export const updateIncidentStatus = (body: { incidentId: string; status: string }) =>
  http.patch('/api/Incident/update-incident-status', body)
