import { Module } from '@nestjs/common'

import { PrismaService } from '@/shared/infra/prisma/prisma.service'
import { CryptographyModule } from '@/shared/providers/cryptography'
import { StorageModule } from '@/shared/providers/storage'
import { TokenModule } from '@/shared/providers/token'

import { AuthController } from './controllers/auth.controller'
import { UserController } from './controllers/user.controller'
import { IUserRepository } from './interfaces/user.interface'
import { UserRepository } from './repository/user.repository'
import { DeleteService } from './use-case/delete'
import { DeleteImageService } from './use-case/delete-image'
import { GetByUniqueService } from './use-case/get-by-unique'
import { LoginService } from './use-case/login'
import { RegisterService } from './use-case/register'
import { UpdateService } from './use-case/update'
import { UpdatePasswordService } from './use-case/update-password'
import { UploadImageService } from './use-case/upload-image'

@Module({
  imports: [CryptographyModule, TokenModule, StorageModule],
  controllers: [UserController, AuthController],
  providers: [
    PrismaService,
    { provide: IUserRepository, useClass: UserRepository },
    GetByUniqueService,
    RegisterService,
    UpdateService,
    DeleteService,
    LoginService,
    UpdatePasswordService,
    UploadImageService,
    DeleteImageService,
  ],
})
export class UserModule {}
