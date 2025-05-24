import { getAllBookingDashboard } from '~/apis/service.api'

export type ServiceItem = {
  name: string
  value: number
  color: string
  icon: 'Spa' | 'LocalLaundryService' | 'Pool' | 'FitnessCenter' | 'ChildCare'
}

const SERVICE_MAP: Record<string, Omit<ServiceItem, 'value'>> = {
  Laundry: { name: 'laundry.name', color: '#10b910', icon: 'LocalLaundryService' },
  Pool: { name: 'pool.name', color: '#3bd1f6', icon: 'Pool' },
  'Fitness center': { name: 'gym.name', color: '#F59E0B', icon: 'FitnessCenter' },
  'Children playground': { name: 'childCare.name', color: '#EC4899', icon: 'ChildCare' },
  'Steam room': { name: 'steamRoom.name', color: '#4F46E5', icon: 'Spa' }
}

export const getServiceData = async (): Promise<{ serviceItems: ServiceItem[]; totalBookings: number }> => {
  try {
    const now = new Date()
    const month = (now.getMonth() + 1).toString()

    const res = await getAllBookingDashboard(month)
    const bookings = res.data || []

    const serviceCount: Record<string, number> = {}
    let totalBookings = 0

    for (const booking of bookings) {
      const service = booking.serviceName
      if (SERVICE_MAP[service]) {
        // Only count if the service name is in our map
        serviceCount[service] = (serviceCount[service] || 0) + 1
        totalBookings++
      }
    }

    const serviceItems: ServiceItem[] = Object.entries(SERVICE_MAP).map(([serviceKey, serviceInfo]) => {
      const count = serviceCount[serviceKey] || 0
      const percentage = totalBookings > 0 ? (count / totalBookings) * 100 : 0

      return {
        ...serviceInfo,
        value: Number(percentage.toFixed(2))
      }
    })

    return { serviceItems, totalBookings }
  } catch (err) {
    console.error('Error fetching booking data:', err)
    return {
      serviceItems: Object.values(SERVICE_MAP).map((service) => ({
        ...service,
        value: 0
      })),
      totalBookings: 0
    }
  }
}
