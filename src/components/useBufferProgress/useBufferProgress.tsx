import { useState, useRef, useEffect } from 'react'

export function useBufferProgress(active: boolean) {
  const [progress, setProgress] = useState(0)
  const [buffer, setBuffer] = useState(10)

  const progressRef = useRef(() => {})

  // Logic cập nhật progress và buffer
  useEffect(() => {
    progressRef.current = () => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) return 0
        return prevProgress + 3
      })

      setBuffer((prevBuffer) => {
        if (progress % 3 === 0) {
          // Mỗi lần progress chia hết cho 3
          const newBuffer = prevBuffer + 2 + Math.random() * 10 // Tăng buffer nhanh hơn
          return newBuffer > 100 ? 100 : newBuffer // Giới hạn buffer ở 100
        }
        return prevBuffer
      })
    }
  }, [progress])

  // Start/stop timer theo trạng thái "active"
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (active) {
      timer = setInterval(() => {
        progressRef.current()
      }, 50) // Giảm thời gian từ 100ms xuống 50ms để chạy nhanh hơn
    } else {
      setProgress(0)
      setBuffer(10)
    }

    return () => clearInterval(timer)
  }, [active])

  return { progress, buffer }
}
