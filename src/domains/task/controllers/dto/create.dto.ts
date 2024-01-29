import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'

export class CreateDTO {
  @IsNotEmpty({ message: 'O campo name é obrigatório.' })
  @IsString({ message: 'O campo name é inválido.' })
  title: string

  @IsNotEmpty({ message: 'O campo listId é obrigatório.' })
  @IsUUID('4', { message: 'O campo listId é inválido.' })
  listId: string

  @IsOptional()
  @IsString({ message: 'O campo color fornecido é inválido.' })
  description?: string
}
