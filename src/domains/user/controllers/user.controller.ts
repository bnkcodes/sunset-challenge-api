import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { User, UserRole } from '@prisma/client'

import { Authenticated } from '@/shared/decorators/authenticated.decorator'
import { Role } from '@/shared/decorators/roles.decorator'
import { AuthenticatedPayload } from '@/shared/types/payload-jwt'

import { DeleteService } from '../use-case/delete'
import { DeleteImageService } from '../use-case/delete-image'
import { GetByUniqueService } from '../use-case/get-by-unique'
import { UpdateService } from '../use-case/update'
import { UpdatePasswordService } from '../use-case/update-password'
import { UploadImageService } from '../use-case/upload-image'
import { UpdatePasswordDTO } from './dto/update-password.dto'
import { UpdateDTO } from './dto/update.dto'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly getByUniqueService: GetByUniqueService,
    private readonly updateService: UpdateService,
    private readonly deleteService: DeleteService,
    private readonly updatePasswordService: UpdatePasswordService,
    private readonly uploadImageService: UploadImageService,
    private readonly deleteImageService: DeleteImageService,
  ) {}

  @Role(UserRole.USER)
  @Get('me')
  @ApiOperation({ summary: 'Get My User Data' })
  public async getMe(@Authenticated() user: AuthenticatedPayload): Promise<User> {
    return this.getByUniqueService.execute({ id: user.id })
  }

  @Role(UserRole.USER)
  @Put('me')
  @ApiOperation({ summary: 'Update My User' })
  public async updateMe(@Body() body: UpdateDTO, @Authenticated() user: AuthenticatedPayload): Promise<User | void> {
    return this.updateService.execute({ id: user.id }, body)
  }

  @Role(UserRole.USER)
  @Patch('me/update-password')
  @ApiOperation({ summary: 'Update My Password' })
  public async updateMyPassword(
    @Body() body: UpdatePasswordDTO,
    @Authenticated() user: AuthenticatedPayload,
  ): Promise<void> {
    return this.updatePasswordService.execute({ id: user.id }, { ...body, skipPasswordValidation: false })
  }

  @Role(UserRole.USER)
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete My Account' })
  public async delete(@Authenticated() user: AuthenticatedPayload): Promise<void> {
    return this.deleteService.execute({ id: user.id })
  }

  @Role(UserRole.USER)
  @Patch('me/upload-image')
  @ApiOperation({ summary: 'Upload My Image' })
  @UseInterceptors(FileInterceptor('file'))
  public async uploadMyImage(
    @Authenticated() user: AuthenticatedPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1000 * 1000 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<User | void> {
    return await this.uploadImageService.execute({
      id: user.id,
      file,
    })
  }

  @Role(UserRole.USER)
  @Patch('me/delete-image')
  @ApiOperation({ summary: 'Delete My Image' })
  public async deleteMyImage(@Authenticated() user: AuthenticatedPayload): Promise<User | void> {
    return await this.deleteImageService.execute({ id: user.id })
  }
}
