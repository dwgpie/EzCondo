import http from '~/utils/http'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

// Citizen
export const addOrUpdateCitizen = (body: {
  userId: string
  no: string
  dateOfIssue: string
  dateOfExpiry: string
  frontImage: File
  backImage: File
}) => {
  const formData = new FormData()
  formData.append('UserId', body.userId)
  formData.append('No', body.no)
  formData.append('DateOfIssue', body.dateOfIssue)
  formData.append('DateOfExpiry', body.dateOfExpiry)
  formData.append('FrontImage', body.frontImage)
  formData.append('BackImage', body.backImage)

  return http.post('/api/Citizen/add-or-update-citizen', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
