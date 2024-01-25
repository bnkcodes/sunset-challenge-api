import { IsOptional, IsString } from 'class-validator'

import { PaginateDTO } from '@/shared/dto/paginate.dto'

export class GetAllDTO extends PaginateDTO {
  @IsOptional()
  @IsString({ message: 'O campo name é inválido.' })
  name: string
}
