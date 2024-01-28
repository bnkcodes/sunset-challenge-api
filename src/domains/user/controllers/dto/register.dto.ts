import { IsString, IsEmail, MinLength, IsNotEmpty, MaxLength, Validate, IsOptional } from 'class-validator'
import { PasswordValidation } from 'class-validator-password-check'

import { Match } from '@/shared/decorators/custom-validator.decorator'
import { PasswordRequirements } from '@/shared/utils/password-requirements'

const passwordRequirements = new PasswordRequirements()

export class RegisterDTO {
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString({ message: 'O campo nome é inválido.' })
  name: string

  @IsNotEmpty({ message: 'O campo e-mail é obrigatório.' })
  @IsEmail({}, { message: 'O e-mail fornecido é inválido.' })
  email: string

  @IsOptional()
  @IsString({ message: 'O telefone fornecido é inválido.' })
  phone: string

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

  @IsString({
    message: 'O campo confirmação de senha é de preenchimento obrigatório.',
  })
  @MinLength(passwordRequirements.minLength, {
    message: `O campo confirmação de senha deve conter no mínimo ${passwordRequirements.minLength} caracteres.`,
  })
  @MaxLength(passwordRequirements.maxLength, {
    message: `O campo confirmação de senha deve conter no máximo ${passwordRequirements.maxLength} caracteres.`,
  })
  @Validate(PasswordValidation, [passwordRequirements.rules], {
    message:
      'O campo confirmação de senha deve conter pelo menos 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial.',
  })
  @Match('password', {
    message: 'O campo confirmação de senha não confere com o campo senha.',
  })
  passwordConfirmation: string
}
