import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { IsString, IsEmail, MinLength, IsNotEmpty, MaxLength, Validate } from 'class-validator'
import { PasswordValidation } from 'class-validator-password-check'

import { PasswordRequirements } from '@/shared/utils/password-requirements'

const passwordRequirements = new PasswordRequirements()

export class AuthUserRequestDTO {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty({ message: 'O campo e-mail é obrigatório.' })
  @IsEmail({}, { message: 'O e-mail fornecido é inválido.' })
  email: string

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty({ message: 'O campo senha é obrigatório.' })
  @IsString({ message: 'O campo senha é inválido.' })
  @MinLength(passwordRequirements.minLength, {
    message: `O campo senha deve conter no mínimo ${passwordRequirements.minLength} caracteres.`,
  })
  @MaxLength(passwordRequirements.maxLength, {
    message: `O campo senha deve conter no máximo ${passwordRequirements.maxLength} caracteres.`,
  })
  @Validate(PasswordValidation, [passwordRequirements.rules], {
    message: 'O campo senha deve conter pelo menos 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial.',
  })
  password: string
}

export class UserDTO {
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

export class AuthUserResponseDTO {
  @ApiProperty({ type: String, required: true })
  accessToken: string

  @ApiProperty({ type: UserDTO, required: true })
  user: UserDTO
}
