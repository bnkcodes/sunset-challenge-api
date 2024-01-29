import { Injectable, NotFoundException } from '@nestjs/common'
import { User } from '@prisma/client'

import { IStorageProvider } from '@/shared/providers/storage'

import { IUserRepository } from '../../interfaces/user.interface'

export type UploadImageServiceInput = {
  id: string
  file: Express.Multer.File
}

@Injectable()
export class UploadImageService {
  constructor(private readonly userRepository: IUserRepository, private readonly storageProvider: IStorageProvider) {}

  public async execute({ id, file }: UploadImageServiceInput): Promise<User | void> {
    const FILE_CONTEXT = 'user'

    const result = await this.userRepository.findByUnique({
      id,
    })

    if (!result) throw new NotFoundException('Usuário não encontrado.')

    if (result.avatarUrl) {
      await this.storageProvider.deleteFile({
        path: result.avatarUrl,
      })
    }

    const image = await this.storageProvider.saveFile({
      context: FILE_CONTEXT,
      file,
    })

    const resultUpdated = await this.userRepository.update(
      { id },
      {
        avatarUrl: image.url,
      },
    )

    if (resultUpdated) delete resultUpdated.password

    return resultUpdated
  }
}
