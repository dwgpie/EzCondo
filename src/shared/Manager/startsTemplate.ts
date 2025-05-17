import { getAllUser } from '~/apis/user.api'
import { getAllApartment } from '~/apis/apartment.api'
import { getAllIncident } from '~/apis/incident.api'
import { getAllParkingLot } from '~/apis/service.api'
import { getAllHouseHoldMember } from '~/apis/householdMember.api'

export type StatItem = {
  title: string
  value: string | number
  icon: 'Apartment' | 'Group' | 'ReportProblem' | 'LocalParking'
  bg: string
  trend?: 'up' | 'down'
  percent?: number
  compareText?: string
}

export const getStatsTemplate = async (): Promise<StatItem[]> => {
  let userCount = 0
  let apartmentCount = 0
  let incidentCount = 0
  let parkingCount = 0
  let totalResidents = 0
  let growthRatePercent = 0
  // let trendDescription = ''

  try {
    const [userRes, apartmentRes, incidentRes, parkingRes, householdMemberRes] = await Promise.all([
      getAllUser(),
      getAllApartment(),
      getAllIncident(),
      getAllParkingLot(),
      getAllHouseHoldMember()
    ])

    const users = Array.isArray(userRes.data) ? userRes.data : userRes.data?.data || []
    userCount = users.filter((u: any) => u.roleName === 'resident').length

    const apartments = Array.isArray(apartmentRes.data) ? apartmentRes.data : apartmentRes.data?.data || []
    apartmentCount = apartments.length
    console.log('apartmentCount', apartmentCount)

    const incidents = Array.isArray(incidentRes.data) ? incidentRes.data : incidentRes.data?.data || []
    incidentCount = incidents.length

    const parkings = Array.isArray(parkingRes.data) ? parkingRes.data : parkingRes.data?.data || []
    parkingCount = parkings.reduce((sum: number, p: any) => sum + (p.total || 0), 0)

    totalResidents = householdMemberRes.data?.totalResidents || 0
    growthRatePercent = householdMemberRes.data?.growthRatePercent || 0
    // trendDescription = householdMemberRes.data?.trendDescription || ''
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
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
      value: totalResidents,
      icon: 'Group',
      bg: 'bg-green-100',
      trend: 'up',
      percent: growthRatePercent,
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
