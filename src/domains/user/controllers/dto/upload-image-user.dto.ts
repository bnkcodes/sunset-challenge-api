import { ApiProperty } from '@nestjs/swagger'

export class UploadImageUserDTO {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File
}
