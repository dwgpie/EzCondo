import { SuccessRespone } from './utils.type'

export type AuthRespone = SuccessRespone<{ token: string; role: string }>
