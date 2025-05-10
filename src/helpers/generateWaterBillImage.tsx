import { getWaterDetail, getWater } from '~/apis/service.api'
import html2canvas from 'html2canvas-pro'
import { createRoot } from 'react-dom/client'
import WaterBillComponent from '~/components/WaterBillComponent'

export async function generateWaterBillImage(waterReadingId: string, t: any, i18n: any): Promise<string> {
  // 1. Fetch dữ liệu hóa đơn nước
  const water = (await getWaterDetail(waterReadingId)).data
  water.waterReadingId = waterReadingId
  const price = (await getWater()).data

  // 2. Tạo một DOM ẩn để render bill
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  document.body.appendChild(container)

  // 3. Render bill vào container bằng createRoot
  const root = createRoot(container)
  root.render(<WaterBillComponent data={water} price={price} t={t} i18n={i18n} />)

  // Đợi một tick để đảm bảo render xong
  await new Promise((resolve) => setTimeout(resolve, 50))

  // 4. Chụp ảnh bill
  const canvas = await html2canvas(container, { useCORS: true, backgroundColor: null, scale: 2 })
  const imgData = canvas.toDataURL('image/png')

  // 5. Cleanup
  root.unmount()
  document.body.removeChild(container)

  return imgData
}
