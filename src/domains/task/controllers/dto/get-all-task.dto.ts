import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

import { PaginateDTO, PaginationResponseDTO } from '@/shared/dto/paginate.dto'

export class GetAllTaskDTO extends PaginateDTO {
  @IsNotEmpty({ message: 'O campo listId é obrigatório.' })
  @IsUUID('4', { message: 'O campo listId é inválido.' })
  listId: string

  @IsOptional()
  @IsString({ message: 'O campo name é inválido.' })
  title?: string
}

export class TaskDTO {
  @ApiProperty({ type: String, required: true })
  id: string

  @ApiProperty({ type: String, required: true })
  userId: string

  @ApiProperty({ type: String, required: true })
  listId: string

  @ApiProperty({ type: String, required: true })
  title: string

  @ApiProperty({ type: String, required: false })
  description?: string

  @ApiProperty({ type: Date, required: true, default: false })
  isCompleted: boolean

  @ApiProperty({ type: Date, required: true })
  createdAt: string

  @ApiProperty({ type: Date, required: true })
  updatedAt: string
}

export class GetAllListResponseDTO {
  @ApiProperty({ type: [TaskDTO], required: true })
  items: TaskDTO[]

  @ApiProperty({ type: PaginationResponseDTO, required: true })
  pagination: PaginationResponseDTO
}
