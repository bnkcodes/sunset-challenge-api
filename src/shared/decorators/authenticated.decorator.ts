import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { AuthenticatedPayload } from '../types/payload-jwt'

export const Authenticated = createParamDecorator(async (_, ctx: ExecutionContext): Promise<AuthenticatedPayload> => {
  return ctx.switchToHttp().getRequest().user as AuthenticatedPayload
})
