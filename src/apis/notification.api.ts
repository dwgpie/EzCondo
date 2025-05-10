import http from '~/utils/http'

export const addNotification = (body: { title: string; content: string; receiver: string; type: string }) =>
  http.post('/api/Notification/create-notification', body)

export const addNotificationToResident = (
  body: {
    title: string
    content: string
    type: string
    apartmentNumber: string
  }[]
) => http.post('/api/Notification/manager-send-to-user', body)

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

export const getNotificationImageById = (body: { notificationId: string }) =>
  http.get(`/api/Notification/get-notification-images-by-id?notificationId=${body.notificationId}`)

export const filterNotification = (body: { type: string; receiver: string; day: number }) => {
  return http.get(
    `/api/Notification/admin-or-manager-get-notifications?type=${body.type}&receiver=${body.receiver}&day=${body.day}&pageSize=100`
  )
}

export const filterNotificationManager = (body: { receiver: string; type: string; day: number }) => {
  return http.get(
    // `/api/Notification/admin-or-manager-get-notifications?type=${body.type}&receiver=resident&day=${body.day}`
    `/api/Notification/admin-or-manager-get-notifications?type=${body.type}&day=${body.day}&pageSize=100`
  )
}

export const getNotification = (body: { type: string; page: number; pageSize: number }) => {
  return http.get(
    `/api/Notification/admin-or-manager-get-notifications?type=${body.type}&page=${body.page}&pageSize=${body.pageSize}`
  )
}

export const receiveNotification = (body: { type: string; page: number; pageSize: number }) => {
  return http.get(
    `/api/Notification/user-get-notifications?type=${body.type}&page=${body.page}&pageSize=${body.pageSize}`
  )
}

export const markAsRead = (body: { notificationIds: string[] }) =>
  http.post('/api/Notification/notifications/mark-as-read', body)
