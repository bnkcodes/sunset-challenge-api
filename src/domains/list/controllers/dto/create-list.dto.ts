import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, IsHexColor } from 'class-validator'

export class CreateListDTO {
  @IsNotEmpty({ message: 'O campo name é obrigatório.' })
  @IsString({ message: 'O campo name é inválido.' })
  name: string

  @IsOptional()
  @IsHexColor({ message: 'O campo color fornecido é inválido.' })
  color?: string
}

export class CreateListResponseDTO {
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
