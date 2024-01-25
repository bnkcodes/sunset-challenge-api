import { DeleteFileInput, DeleteFileOutput } from '../types/delete-file'
import { SendFileInput, SendFileOutput } from '../types/send-file'

export abstract class IStorageProvider {
  abstract saveFile(data: SendFileInput): Promise<SendFileOutput>
  abstract deleteFile(data: DeleteFileInput): Promise<DeleteFileOutput>
}
