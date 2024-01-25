import { IsOptional, IsString } from 'class-validator'

export class UpdateDTO {
  @IsOptional()
  @IsString({ message: 'O campo name é inválido.' })
  title: string

  @IsOptional()
  @IsString({ message: 'O campo color fornecido é inválido.' })
  description?: string
}
