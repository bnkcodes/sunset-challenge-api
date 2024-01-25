import { IsString, IsNotEmpty, IsOptional, IsHexColor } from 'class-validator'

export class CreateDTO {
  @IsNotEmpty({ message: 'O campo name é obrigatório.' })
  @IsString({ message: 'O campo name é inválido.' })
  name: string

  @IsOptional()
  @IsHexColor({ message: 'O campo color fornecido é inválido.' })
  color?: string
}
