import { IsNumberString, IsOptional, IsString } from 'class-validator'

export class PaginateDTO {
  @IsOptional()
  @IsNumberString({}, { message: 'O campo page é inválido.' })
  page?: number

  @IsOptional()
  @IsNumberString({}, { message: 'O campo perPage é inválido.' })
  perPage?: number

  @IsOptional()
  @IsString({ message: 'O campo skip é inválido.' })
  sort?: string
}
