import { getIncome } from '~/apis/service.api'

export type IncomeItem = {
  month: string
  value: number
}

// Define a type for the expected API response structure
export type IncomeApiResponse = {
  totalRevenue: number
  percentChange: number
  monthlyRevenue: IncomeItem[]
}

export const getMonthlyIncomeData = async (): Promise<IncomeItem[]> => {
  try {
    const response = await getIncome() // Assuming getIncome fetches the data in the provided format
    // Access the data property of the Axios response
    const incomeData: IncomeApiResponse = response.data
    return incomeData.monthlyRevenue.map((item) => ({
      month: item.month,
      value: item.value
    }))
  } catch (error) {
    console.error('Error fetching income data:', error)
    return [] // Return empty array in case of error
  }
}

export const getTotalRevenueStats = async (): Promise<{ totalRevenue: number; percentChange: number }> => {
  try {
    const response = await getIncome()
    const incomeData: IncomeApiResponse = response.data
    return { totalRevenue: incomeData.totalRevenue, percentChange: incomeData.percentChange }
  } catch (error) {
    console.error('Error fetching total revenue stats:', error)
    return { totalRevenue: 0, percentChange: 0 } // Return default values in case of error
  }
}
