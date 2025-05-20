// import { getAllBooking, getAllPayment } from '~/apis/service.api'

// export const getTotalTransactionsByMonth = async (month: string): Promise<number> => {
//   try {
//     // Fetch booking data (assuming search can be empty for total count)
//     const bookingResponse = await getAllBooking('', month)
//     const bookingCount = bookingResponse.data?.length || 0

//     // Fetch payment data
//     const paymentResponse = await getAllPayment(month)
//     const paymentCount = paymentResponse.data?.length || 0

//     // Return the total count of transactions (bookings + payments)
//     return bookingCount + paymentCount
//   } catch (error) {
//     console.error(`Error fetching transactions for month ${month}:`, error)
//     return 0 // Return 0 in case of an error
//   }
// }

export const getTotalTransactionsByMonth = async (month: string): Promise<number> => {
  try {
    // Fake data for demonstration
    const fakeBookingCount = Math.floor(Math.random() * 50) + 10 // Random number between 10 and 60
    const fakePaymentCount = Math.floor(Math.random() * 40) + 10 // Random number between 10 and 50

    // Return the total count of transactions (bookings + payments)
    return fakeBookingCount + fakePaymentCount
  } catch (error) {
    console.error(`Error fetching transactions for month ${month}:`, error)
    return 0 // Return 0 in case of an error
  }
}
