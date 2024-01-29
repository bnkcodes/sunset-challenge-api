import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'

export class CreateTaskDTO {
  @IsNotEmpty({ message: 'O campo listId é obrigatório.' })
  @IsUUID('4', { message: 'O campo listId é inválido.' })
  listId: string

  @IsNotEmpty({ message: 'O campo name é obrigatório.' })
  @IsString({ message: 'O campo name é inválido.' })
  title: string

  @IsOptional()
  @IsString({ message: 'O campo color fornecido é inválido.' })
  description?: string
}

export class CreateTaskResponseDTO {
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
