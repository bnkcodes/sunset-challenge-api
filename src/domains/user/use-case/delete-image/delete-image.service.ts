import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

import { IStorageProvider } from '@/shared/providers/storage'

import { IUserRepository } from '../../interfaces/user.interface'

export type UploadImageServiceInput = {
  id: string
}

@Injectable()
export class DeleteImageService {
  constructor(private readonly userRepository: IUserRepository, private readonly storageProvider: IStorageProvider) {}

  public async execute({ id }: UploadImageServiceInput): Promise<User | void> {
    const result = await this.userRepository.findByUnique({
      id,
    })

    if (!result) throw new BadRequestException('Usuário não encontrado.')

    if (result.avatarUrl) {
      await this.storageProvider.deleteFile({
        path: result.avatarUrl,
      })
    }

    const resultUpdated = await this.userRepository.update(
      { id },
      {
        avatarUrl: null,
      },
    )

    if (resultUpdated) delete resultUpdated.password

    return resultUpdated
  }
}
