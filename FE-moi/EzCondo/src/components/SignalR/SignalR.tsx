// src/hooks/useSignalR.ts
import { useEffect, useState } from 'react'
import * as signalR from '@microsoft/signalr'

export const useSignalR = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null)
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    // Tạo kết nối đến hub backend với đường dẫn tương ứng
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('/notificationHub') // Đảm bảo rằng url trùng với app.MapHub<NotificationHub>("/notificationHub")
      .withAutomaticReconnect()
      .build()

    setConnection(newConnection)
  }, [])

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log('SignalR Connected.')
          // Đăng ký lắng nghe sự kiện từ backend, ví dụ như 'ReceiveNotification'
          connection.on('ReceiveNotification', (message: string) => {
            setMessages((prevMessages) => [...prevMessages, message])
          })
        })
        .catch((error) => console.error('SignalR Connection Error: ', error))

      // Hủy đăng ký và dừng kết nối khi component unmount
      return () => {
        connection.stop()
      }
    }
  }, [connection])

  return { messages }
}
