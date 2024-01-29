import { ForbiddenException } from '@nestjs/common'

import { IListRepository } from '@/domains/list/interfaces/list.interface'
import { ITaskRepository } from '@/domains/task/interfaces/task.interface'

/**
 * @function
 * @description Função para validar se o usuário tem vínculo á documento(s) específica(s)
 * @param {string} requesterId - Id do usuário a ser verificado
 * @param {string} documentId - Id do usuário a ser verificado
 * @param {IPrismaRepository} repository - Repositório da entidade para realizar o find
 */

export async function validateOwnership(
  requesterId: string,
  documentId: string,
  repository: IListRepository | ITaskRepository,
) {
  const requesterHavePermission = await repository.findByUnique({
    id: documentId,
    userId: requesterId,
  })

  if (!requesterHavePermission) {
    throw new ForbiddenException('Você não possui permissão para isso.')
  }
}
