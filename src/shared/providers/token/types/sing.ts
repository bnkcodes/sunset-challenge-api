import { UserRole } from '@prisma/client'

export type SingInput = {
  jwtSecret: string
  jwtExpiresIn: string
  id?: string
  email: string
  name: string
  role?: UserRole
}

export type SingOutput = string
