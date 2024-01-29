import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

import { PaginateDTO } from '@/shared/dto/paginate.dto'

export class GetAllDTO extends PaginateDTO {
  @IsNotEmpty({ message: 'O campo listId é obrigatório.' })
  @IsUUID('4', { message: 'O campo listId é inválido.' })
  listId: string

  @IsOptional()
  @IsString({ message: 'O campo name é inválido.' })
  title: string
}
