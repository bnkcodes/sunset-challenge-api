import { CompareInput, CompareOutput } from '../types/compare'
import { EncryptInput, EncryptOutput } from '../types/encrypt'

export abstract class ICryptographyProvider {
  abstract encrypt(data: EncryptInput): Promise<EncryptOutput>
  abstract compare(data: CompareInput): Promise<CompareOutput>
}
