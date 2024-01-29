import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { IsEmail, IsOptional, IsString } from 'class-validator'

export class UpdateUserDTO {
  @IsOptional()
  @IsString({ message: 'O campo name é inválido.' })
  name: string

  @IsOptional()
  @IsString({ message: 'O campo phone é inválido.' })
  phone?: string

  @IsOptional()
  @IsEmail({}, { message: 'O e-mail fornecido é inválido.' })
  email: string
}

export class UpdateUserResponseDTO {
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
