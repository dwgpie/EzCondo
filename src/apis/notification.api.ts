import http from '~/utils/http'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

export const addNotification = (body: { title: string; content: string; receiver: string; type: string }) =>
  http.post('/api/Notification/create-notification', body)

export const addNotificationImages = (body: { NotificationId: string; Image: File[] }) => {
  const formData = new FormData()
  formData.append('NotificationId', body.NotificationId)
  // Lặp qua từng ảnh và thêm vào FormData
  body.Image.forEach((Image) => {
    formData.append('Image', Image)
  })
  return http.post('/api/Notification/create-notification-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// /api/Notification/admin-or-manager-get-notifications?type=&receiver=&page=1&pageSize=10&day=7

export const filterNotification = (body: { type: string; receiver: string; day: number }) => {
  return http.get(
    `/api/Notification/admin-or-manager-get-notifications?type=${body.type}&receiver=${body.receiver}&day=${body.day}`
  )
}
