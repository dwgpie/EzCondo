import { getAllApartmentDashboard } from '~/apis/apartment.api'
import { getAllIncidentDashboard } from '~/apis/incident.api'
import { getAllParkingLotDashboard } from '~/apis/service.api'
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
  let totalAparments = 0
  let growthRatePercentAparment = 0
  let trendDescriptionAparment = ''
  let totalIncidents = 0
  let growthRatePercentIncident = 0
  let trendDescriptionIncident = ''
  let totalResidents = 0
  let growthRatePercentResident = 0
  let trendDescriptionResident = ''
  let totalParking = 0
  let growthRatePercentParking = 0
  let trendDescriptionParking = ''

  try {
    const [apartmentRes, incidentRes, parkingRes, householdMemberRes] = await Promise.all([
      getAllApartmentDashboard(),
      getAllIncidentDashboard(),
      getAllParkingLotDashboard(),
      getAllHouseHoldMember()
    ])
    totalAparments = apartmentRes.data?.total || 0
    growthRatePercentAparment = apartmentRes.data?.growthRatePercent || 0
    trendDescriptionAparment = apartmentRes.data?.trendDescription || ''

    totalIncidents = incidentRes.data?.total || 0
    growthRatePercentIncident = incidentRes.data?.growthRatePercent || 0
    trendDescriptionIncident = incidentRes.data?.trendDescription || ''

    totalResidents = householdMemberRes.data?.total || 0
    growthRatePercentResident = householdMemberRes.data?.growthRatePercent || 0
    trendDescriptionResident = householdMemberRes.data?.trendDescription || ''

    totalParking = parkingRes.data?.total || 0
    growthRatePercentParking = parkingRes.data?.growthRatePercent || 0
    trendDescriptionParking = parkingRes.data?.trendDescription || ''
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  }

  return [
    {
      title: 'start.totalApartments',
      value: totalAparments,
      icon: 'Apartment',
      bg: 'bg-blue-100',
      trend: growthRatePercentAparment > 0 ? 'up' : 'down',
      percent: growthRatePercentAparment,
      compareText: trendDescriptionAparment
    },
    {
      title: 'start.totalResidents',
      value: totalResidents,
      icon: 'Group',
      bg: 'bg-green-100',
      trend: growthRatePercentResident > 0 ? 'up' : 'down',
      percent: growthRatePercentResident,
      compareText: trendDescriptionResident
    },
    {
      title: 'start.totalIncidents',
      value: totalIncidents,
      icon: 'ReportProblem',
      bg: 'bg-red-100',
      trend: growthRatePercentIncident > 0 ? 'up' : 'down',
      percent: growthRatePercentIncident,
      compareText: trendDescriptionIncident
    },
    {
      title: 'start.totalParking',
      value: totalParking,
      icon: 'LocalParking',
      bg: 'bg-purple-100',
      trend: growthRatePercentParking > 0 ? 'up' : 'down',
      percent: growthRatePercentParking,
      compareText: trendDescriptionParking
    }
  ]
}
