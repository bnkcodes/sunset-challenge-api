import { UserRole } from '@prisma/client'
import { JwtPayload } from 'jsonwebtoken'

export type DecodeInput = {
  jwtSecret: string
  token: string
}

export interface DecodeOutput extends JwtPayload {
  id: string
  email: string
  role: UserRole
  isActive: true
}
