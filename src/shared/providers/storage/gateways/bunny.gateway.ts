import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import axios from 'axios'
import { randomBytes } from 'node:crypto'

import { EnvironmentVariables, EnvironmentVariablesType } from '@/config/env'

import { IStorageProvider } from '../interface/IStorageProvider'
import { DeleteFileInput, DeleteFileOutput } from '../types/delete-file'
import { SendFileInput, SendFileOutput } from '../types/send-file'

@Injectable()
export class BunnyGateway implements IStorageProvider {
  constructor(
    @Inject(EnvironmentVariables.KEY)
    private readonly config: EnvironmentVariablesType,
  ) {}

  public async saveFile({ context, file }: SendFileInput): Promise<SendFileOutput> {
    const hash = randomBytes(10).toString('hex')

    const FILE_PATH = `${context}/${hash}.${this.getFileExtension(file.mimetype)}`

    await axios
      .put(`https://${this.config.bunny.hostname}/${this.config.bunny.storageName}/${FILE_PATH}`, file.buffer, {
        headers: {
          AccessKey: this.config.bunny.apiKey,
          'Content-Type': 'application/octet-stream',
        },
      })
      .catch((e) => {
        throw new InternalServerErrorException([e])
      })

    return {
      url: FILE_PATH,
    }
  }

  public async deleteFile({ path }: DeleteFileInput): Promise<DeleteFileOutput> {
    await axios
      .delete(`https://${this.config.bunny.hostname}/${this.config.bunny.storageName}/${path}`, {
        headers: {
          AccessKey: this.config.bunny.apiKey,
        },
      })
      .catch((e) => {
        throw new InternalServerErrorException([e])
      })
  }

  private getFileExtension(mimetype: string) {
    return mimetype.slice(((mimetype.lastIndexOf('/') - 1) >>> 0) + 2)
  }
}
