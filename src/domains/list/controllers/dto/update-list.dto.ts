import { ApiProperty } from '@nestjs/swagger'
import { IsHexColor, IsOptional, IsString } from 'class-validator'

export class UpdateListDTO {
  @IsOptional()
  @IsString({ message: 'O campo name é inválido.' })
  name: string

  @IsOptional()
  @IsHexColor({ message: 'O campo color fornecido é inválido.' })
  color?: string
}

export class UpdateListResponseDTO {
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
