import { filterElectricDashboard } from '~/apis/service.api'
import { filterWaterDashboard } from '~/apis/service.api'

export type PaymentItem = {
  month: string
  paid: number
  unpaid: number
}

export const getPaymentData = async (month: string): Promise<PaymentItem[]> => {
  // Lấy toàn bộ danh sách hóa đơn/thanh toán của tháng cho cả điện và nước
  const [electricRes, waterRes] = await Promise.all([
    filterElectricDashboard({ status: '', month }),
    filterWaterDashboard({ status: '', month })
  ])

  // Đếm số lượng từng trạng thái cho điện
  const electricData = Array.isArray(electricRes.data) ? electricRes.data : []
  const paidElectric = electricData.filter((item) => item.status === 'completed').length
  const unpaidElectric = electricData.filter((item) => item.status === 'pending' || item.status === 'overdue').length

  // Đếm số lượng từng trạng thái cho nước
  const waterData = Array.isArray(waterRes.data) ? waterRes.data : []
  const paidWater = waterData.filter((item) => item.status === 'completed').length
  const unpaidWater = waterData.filter((item) => item.status === 'pending' || item.status === 'overdue').length

  // Cộng lại
  const paid = paidElectric + paidWater
  const unpaid = unpaidElectric + unpaidWater

  return [
    {
      month,
      paid,
      unpaid: -unpaid
    }
  ]
}
