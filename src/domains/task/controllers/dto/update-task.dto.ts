import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateTaskDTO {
  @IsOptional()
  @IsString({ message: 'O campo title é inválido.' })
  title: string

  @IsOptional()
  @IsString({ message: 'O campo description fornecido é inválido.' })
  description?: string
}

export class UpdateTaskResponseDTO {
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
