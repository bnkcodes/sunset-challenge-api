import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateDTO {
  @IsOptional()
  @IsString({ message: 'O campo name é inválido.' })
  @MinLength(3)
  name: string

  @IsOptional()
  @IsString({ message: 'O campo phone é inválido.' })
  phone: string

  @IsOptional()
  @IsEmail({}, { message: 'O e-mail fornecido é inválido.' })
  email: string
}
