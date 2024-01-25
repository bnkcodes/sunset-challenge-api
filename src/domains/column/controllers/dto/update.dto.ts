import { IsHexColor, IsOptional, IsString } from 'class-validator'

export class UpdateDTO {
  @IsOptional()
  @IsString({ message: 'O campo name é inválido.' })
  name: string

  @IsOptional()
  @IsHexColor({ message: 'O campo color fornecido é inválido.' })
  color?: string
}
