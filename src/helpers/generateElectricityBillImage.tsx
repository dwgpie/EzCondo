import { getElectricDetail, getElectric } from '~/apis/service.api'
import html2canvas from 'html2canvas-pro'
import { createRoot } from 'react-dom/client'
import BillComponent from '~/components/BillComponent'

export async function generateElectricityBillImage(electricReadingId: string, t: any, i18n: any): Promise<string> {
  // 1. Fetch dữ liệu hóa đơn
  const electric = (await getElectricDetail(electricReadingId)).data
  electric.electricReadingId = electricReadingId
  const priceList = (await getElectric()).data.sort((a: any, b: any) => a.minKWh - b.minKWh)

  // 2. Tạo một DOM ẩn để render bill
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  document.body.appendChild(container)

  // 3. Render bill vào container bằng createRoot
  const root = createRoot(container)
  root.render(<BillComponent data={electric} priceList={priceList} t={t} i18n={i18n} />)

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
