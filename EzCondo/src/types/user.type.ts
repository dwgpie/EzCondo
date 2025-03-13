type Role = 'admin' | 'resident' | 'manager'
type Gender = 'male' | 'man'

export interface User {
  id: string
  fullName: string
  dateOfBirth: string
  gender: Gender // Chỉ cần string, không phải array
  apartmentNumber: string
  phoneNumber: string
  email: string
  status: string
  roleName: Role // Chỉ cần string, không phải array
}
