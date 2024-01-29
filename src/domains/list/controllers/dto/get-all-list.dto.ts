import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

import { PaginateDTO, PaginationResponseDTO } from '@/shared/dto/paginate.dto'

export class GetAllListDTO extends PaginateDTO {
  @IsOptional()
  @IsString({ message: 'O campo name é inválido.' })
  name?: string
}

export class ListDTO {
  @ApiProperty({ type: String, required: true })
  id: string

  @ApiProperty({ type: String, required: true })
  userId: string

  @ApiProperty({ type: String, required: true })
  name: string

  @ApiProperty({ type: String, required: true })
  color: string

  @ApiProperty({ type: Date, required: true })
  createdAt: string

  @ApiProperty({ type: Date, required: true })
  updatedAt: string
}

export class GetAllListResponseDTO {
  @ApiProperty({ type: [ListDTO], required: true })
  items: ListDTO[]

  @ApiProperty({ type: PaginationResponseDTO, required: true })
  pagination: PaginationResponseDTO
}
