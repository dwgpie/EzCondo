import { getAllBookingDashboard } from '~/apis/service.api'

export type ServiceItem = {
  name: string
  value: number
  color: string
  icon: 'Spa' | 'LocalLaundryService' | 'Pool' | 'FitnessCenter' | 'ChildCare'
}

const SERVICE_MAP: Record<string, Omit<ServiceItem, 'value'>> = {
  Spa: { name: 'Phòng xông hơi', color: '#4F46E5', icon: 'Spa' },
  Laundry: { name: 'Giặt ủi', color: '#10b910', icon: 'LocalLaundryService' },
  Pool: { name: 'Bể bơi', color: '#3bd1f6', icon: 'Pool' },
  Gym: { name: 'Gym', color: '#F59E0B', icon: 'FitnessCenter' },
  ChildCare: { name: 'Khu vui chơi trẻ em', color: '#EC4899', icon: 'ChildCare' }
}

export const getServiceData = async (): Promise<ServiceItem[]> => {
  try {
    const now = new Date()
    const month = (now.getMonth() + 1).toString()

    const res = await getAllBookingDashboard(month)
    const bookings = res.data || []

    const serviceCount: Record<string, number> = {}
    let totalBookings = 0

    for (const booking of bookings) {
      const service = booking.serviceName
      serviceCount[service] = (serviceCount[service] || 0) + 1
      totalBookings++
    }

    const result: ServiceItem[] = Object.entries(SERVICE_MAP).map(([serviceKey, serviceInfo]) => {
      const count = serviceCount[serviceKey] || 0
      const percentage = totalBookings > 0 ? (count / totalBookings) * 100 : 0

      return {
        ...serviceInfo,
        value: Number(percentage.toFixed(2))
      }
    })

    return result
  } catch (err) {
    console.error('Error fetching booking data:', err)
    return Object.values(SERVICE_MAP).map((service) => ({
      ...service,
      value: 0
    }))
  }
}
