import { User } from './user.type'
import { SuccessRespone } from './utils.type'

export type AuthRespone = SuccessRespone<{ token: string; user: User }>
