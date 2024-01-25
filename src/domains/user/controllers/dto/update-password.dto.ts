import { IsOptional, IsString, MaxLength, MinLength, Validate, ValidateIf } from 'class-validator'
import { PasswordValidation } from 'class-validator-password-check'

import { Match } from '@/shared/decorators/custom-validator.decorator'
import { PasswordRequirements } from '@/shared/utils/password-requirements'

const passwordRequirements = new PasswordRequirements()

export class UpdatePasswordDTO {
  @ValidateIf(({ password }) => password !== undefined, {
    message: 'Necessário informar a senha anterior para atualizar com a nova senha.',
  })
  @IsString({ message: 'O campo senha anterior é inválido.' })
  oldPassword?: string

  @IsOptional()
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
