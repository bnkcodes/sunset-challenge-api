import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '@prisma/client'

import { IS_PUBLIC_KEY } from '../decorators/allow-public-access.decorator'
import { ROLE_KEY } from '../decorators/roles.decorator'
import { AuthenticatedPayload } from '../types/payload-jwt'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const role = this.reflector.get<string>(ROLE_KEY, context.getHandler())

    if (!role) {
      return true
    }

    const account = context.switchToHttp().getRequest().user as AuthenticatedPayload

    const roleValues: Record<UserRole, number> = {
      [UserRole.USER]: 0,
      [UserRole.ADMIN]: 1,
    }

    if (roleValues[account.role] >= roleValues[role]) return true
    else throw new UnauthorizedException(['Sua conta não tem permissão para acessar. Procure um administrador.'])
  }
}
