import { UserRole } from '@prisma/client'

export type AuthenticatedPayload = {
  id: string
  email: string
  role: UserRole
  iat: number
  exp: number
}
