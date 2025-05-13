import { getAllUser } from '~/apis/user.api'
import { getAllApartment } from '~/apis/apartment.api'
import { getAllIncident } from '~/apis/incident.api'
import { getAllParking } from '~/apis/service.api'

export type StatItem = {
  title: string
  value: string
  icon: 'Apartment' | 'Group' | 'ReportProblem' | 'LocalParking'
  bg: string
  trend: 'up' | 'down'
  percent: number
  compareText: string
}

export const getStatsTemplate = async (): Promise<StatItem[]> => {
  let userCount = 0
  let apartmentCount = 0
  let incidentCount = 0
  let parkingCount = 0
  try {
    const [userRes, apartmentRes, incidentRes, parkingRes] = await Promise.all([
      getAllUser(),
      getAllApartment(),
      getAllIncident(),
      getAllParking()
    ])
    const users = Array.isArray(userRes.data) ? userRes.data : userRes.data?.data || []
    userCount = users.filter((u: any) => u.roleName === 'resident').length
    const apartments = Array.isArray(apartmentRes.data) ? apartmentRes.data : apartmentRes.data?.data || []
    apartmentCount = apartments.length
    const incidents = Array.isArray(incidentRes.data) ? incidentRes.data : incidentRes.data?.data || []
    incidentCount = incidents.length
    const parkings = Array.isArray(parkingRes.data) ? parkingRes.data : parkingRes.data?.data || []
    parkingCount = parkings.reduce((sum: number, p: any) => sum + (p.total || 0), 0)
  } catch {
    userCount = 0
    apartmentCount = 0
    incidentCount = 0
    parkingCount = 0
  }

  const occupancy = apartmentCount > 0 ? ((userCount / apartmentCount) * 100).toFixed(1) + '%' : '0%'

  return [
    {
      title: 'Tỷ lệ lấp đầy',
      value: occupancy,
      icon: 'Apartment',
      bg: 'bg-blue-100',
      trend: 'up',
      percent: 2.5,
      compareText: 'Tăng so với tuần trước'
    },
    {
      title: 'Tổng số cư dân',
      value: userCount.toString(),
      icon: 'Group',
      bg: 'bg-green-100',
      trend: 'up',
      percent: 1.2,
      compareText: 'Tăng so với tuần trước'
    },
    {
      title: 'Sự cố',
      value: incidentCount.toString(),
      icon: 'ReportProblem',
      bg: 'bg-red-100',
      trend: 'down',
      percent: 0.8,
      compareText: 'Giảm so với tuần trước'
    },
    {
      title: 'Số vé xe',
      value: parkingCount.toString(),
      icon: 'LocalParking',
      bg: 'bg-purple-100',
      trend: 'up',
      percent: 1.2,
      compareText: 'Tăng so với tuần trước'
    }
  ]
}
