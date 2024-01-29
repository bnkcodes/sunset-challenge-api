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
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
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
import { GetMeUserResponseDTO } from './dto/get-me-user.dto'
import { UpdateUserPasswordDTO } from './dto/update-user-password.dto'
import { UpdateUserDTO, UpdateUserResponseDTO } from './dto/update-user.dto'
import { UploadImageUserDTO } from './dto/upload-image-user.dto'

@ApiBearerAuth()
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

  @Get('me')
  @Role(UserRole.USER)
  @ApiOperation({ summary: 'Get authenticated user data' })
  @ApiResponse({ status: 200, type: GetMeUserResponseDTO })
  public async getMe(@Authenticated() user: AuthenticatedPayload): Promise<User> {
    return this.getByUniqueService.execute({ id: user.id })
  }

  @Put('me')
  @Role(UserRole.USER)
  @ApiOperation({ summary: 'Update authenticated user data' })
  @ApiResponse({ status: 200, type: UpdateUserResponseDTO })
  public async updateMe(
    @Body() updateUserDTO: UpdateUserDTO,
    @Authenticated() user: AuthenticatedPayload,
  ): Promise<User | void> {
    return this.updateService.execute({ id: user.id }, updateUserDTO)
  }

  @Role(UserRole.USER)
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete authenticated user account' })
  public async delete(@Authenticated() user: AuthenticatedPayload): Promise<void> {
    return this.deleteService.execute({ id: user.id })
  }

  @Role(UserRole.USER)
  @Patch('me/update-password')
  @ApiOperation({ summary: 'Update authenticated user password' })
  @ApiResponse({ status: 200, type: UpdateUserResponseDTO })
  public async updateMyPassword(
    @Body() updateUserPasswordDTO: UpdateUserPasswordDTO,
    @Authenticated() user: AuthenticatedPayload,
  ): Promise<void> {
    return this.updatePasswordService.execute(
      {
        id: user.id,
      },
      {
        ...updateUserPasswordDTO,
        skipPasswordValidation: false,
      },
    )
  }

  @Patch('me/upload-image')
  @Role(UserRole.USER)
  @ApiOperation({ summary: 'Upload an photo for authenticated user' })
  @ApiResponse({ status: 200, type: UpdateUserResponseDTO })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadMyImage(
    @Body() uploadImageUserDTO: UploadImageUserDTO,
    @Authenticated() user: AuthenticatedPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1000 * 1000 }),
          new FileTypeValidator({ fileType: 'image' }),
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
  @ApiOperation({ summary: 'Delete authenticated user photo' })
  @ApiResponse({ status: 200, type: UpdateUserResponseDTO })
  public async deleteMyImage(@Authenticated() user: AuthenticatedPayload): Promise<User | void> {
    return await this.deleteImageService.execute({ id: user.id })
  }
}
