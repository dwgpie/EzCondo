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
  thisWeek?: number
  lastWeek?: number
}

export const getStatsTemplate = async (): Promise<StatItem[]> => {
  let totalAparments = 0
  let growthRatePercentAparment = 0
  let trendDescriptionAparment = ''
  let apartmentThisWeek = 0
  let apartmentLastWeek = 0

  let totalIncidents = 0
  let growthRatePercentIncident = 0
  let trendDescriptionIncident = ''
  let incidentThisWeek = 0
  let incidentLastWeek = 0

  let totalResidents = 0
  let growthRatePercentResident = 0
  let trendDescriptionResident = ''
  let residentThisWeek = 0
  let residentLastWeek = 0

  let totalParking = 0
  let growthRatePercentParking = 0
  let trendDescriptionParking = ''
  let parkingThisWeek = 0
  let parkingLastWeek = 0

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
    apartmentThisWeek = apartmentRes.data?.apartmentThisWeek || 0
    apartmentLastWeek = apartmentRes.data?.apartmentLastWeek || 0

    totalIncidents = incidentRes.data?.total || 0
    growthRatePercentIncident = incidentRes.data?.growthRatePercent || 0
    trendDescriptionIncident = incidentRes.data?.trendDescription || ''
    incidentThisWeek = incidentRes.data?.apartmentThisWeek || 0
    incidentLastWeek = incidentRes.data?.apartmentLastWeek || 0

    totalResidents = householdMemberRes.data?.total || 0
    growthRatePercentResident = householdMemberRes.data?.growthRatePercent || 0
    trendDescriptionResident = householdMemberRes.data?.trendDescription || ''
    residentThisWeek = householdMemberRes.data?.apartmentThisWeek || 0
    residentLastWeek = householdMemberRes.data?.apartmentLastWeek || 0

    totalParking = parkingRes.data?.total || 0
    growthRatePercentParking = parkingRes.data?.growthRatePercent || 0
    trendDescriptionParking = parkingRes.data?.trendDescription || ''
    parkingThisWeek = parkingRes.data?.apartmentThisWeek || 0
    parkingLastWeek = parkingRes.data?.apartmentLastWeek || 0
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  }

  return [
    {
      title: 'start.totalApartments',
      value: `${totalAparments}%`,
      icon: 'Apartment',
      bg: 'bg-blue-100',
      trend: growthRatePercentAparment > 0 ? 'up' : 'down',
      percent: growthRatePercentAparment,
      compareText: trendDescriptionAparment,
      thisWeek: apartmentThisWeek,
      lastWeek: apartmentLastWeek
    },
    {
      title: 'start.totalResidents',
      value: totalResidents,
      icon: 'Group',
      bg: 'bg-green-100',
      trend: growthRatePercentResident > 0 ? 'up' : 'down',
      percent: growthRatePercentResident,
      compareText: trendDescriptionResident,
      thisWeek: residentThisWeek,
      lastWeek: residentLastWeek
    },
    {
      title: 'start.totalIncidents',
      value: totalIncidents,
      icon: 'ReportProblem',
      bg: 'bg-red-100',
      trend: growthRatePercentIncident > 0 ? 'up' : 'down',
      percent: growthRatePercentIncident,
      compareText: trendDescriptionIncident,
      thisWeek: incidentThisWeek,
      lastWeek: incidentLastWeek
    },
    {
      title: 'start.totalParking',
      value: totalParking,
      icon: 'LocalParking',
      bg: 'bg-purple-100',
      trend: growthRatePercentParking > 0 ? 'up' : 'down',
      percent: growthRatePercentParking,
      compareText: trendDescriptionParking,
      thisWeek: parkingThisWeek,
      lastWeek: parkingLastWeek
    }
  ]
}
