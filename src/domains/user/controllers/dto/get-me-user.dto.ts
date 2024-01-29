import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'

export class GetMeUserResponseDTO {
  @ApiProperty({ type: String, required: true })
  id: string

  @ApiProperty({ type: String, required: true })
  name: string

  @ApiProperty({ type: String, required: true })
  email: string

  @ApiProperty({ type: String, required: false })
  phone?: string

  @ApiProperty({ type: String, required: false })
  avatarUrl?: string

  @ApiProperty({ type: String, enum: UserRole, required: true })
  role: string
}
