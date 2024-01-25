import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard, IAuthGuard } from '@nestjs/passport'

import { IS_PUBLIC_KEY } from '../decorators/allow-public-access.decorator'
import { AuthenticatedPayload } from '../types/payload-jwt'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
  constructor(private reflector: Reflector) {
    super()
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    return super.canActivate(context)
  }

  handleRequest<Account extends AuthenticatedPayload>(_: Error, user: Account): Account {
    if (user) return user
    else throw new UnauthorizedException(['Solicitação não autorizada.'])
  }
}
