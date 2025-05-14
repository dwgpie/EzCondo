import { getAllParking, getAllParkingLot, getParking } from '~/apis/service.api'
import html2canvas from 'html2canvas-pro'
import { createRoot } from 'react-dom/client'
import ParkingBillComponent from '~/components/ParkingBillComponent'

export async function generateParkingBillImage(parkingId: string, t: any, i18n: any): Promise<string> {
  // 1. Fetch dữ liệu hóa đơn đỗ xe
  const parkingLot = (await getAllParkingLot()).data
  const parking = (await getAllParking()).data

  // 2. Tìm thông tin bãi đỗ & hóa đơn theo ID
  const parkingLotInfo = parkingLot.find((p: any) => p.parkingId === parkingId)
  const parkingInfo = parking.find((b: any) => b.parkingId === parkingId)

  if (!parkingLotInfo || !parkingInfo) {
    throw new Error('Không tìm thấy dữ liệu đỗ xe hoặc hóa đơn')
  }

  // 3. Gộp thông tin để truyền vào component
  const data = {
    ...parkingLotInfo,
    ...parkingInfo
  }

  parking.parkingId = parkingId
  const price = (await getParking()).data

  // 4. Tạo một DOM ẩn để render bill
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  document.body.appendChild(container)

  // 5. Render bill vào container bằng createRoot
  const root = createRoot(container)
  root.render(<ParkingBillComponent data={data} price={price} t={t} i18n={i18n} />)

  // Đợi một tick để đảm bảo render xong
  await new Promise((resolve) => setTimeout(resolve, 50))

  // 6. Chụp ảnh bill
  const canvas = await html2canvas(container, { useCORS: true, backgroundColor: null, scale: 2 })
  const imgData = canvas.toDataURL('image/png')

  // 7. Cleanup
  root.unmount()
  document.body.removeChild(container)

  return imgData
}
