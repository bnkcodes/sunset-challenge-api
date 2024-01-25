import { Injectable } from '@nestjs/common'
import { sign as _sign, verify } from 'jsonwebtoken'

import { ITokenProvider } from '../interface/ITokenProvider'
import { DecodeInput, DecodeOutput } from '../types/decode'
import { SingInput, SingOutput } from '../types/sing'

@Injectable()
export class JWTGateway implements ITokenProvider {
  public async sign(data: SingInput): Promise<SingOutput> {
    return _sign(
      {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      },
      data.jwtSecret,
      {
        expiresIn: data.jwtExpiresIn,
      },
    )
  }

  public async decode(data: DecodeInput): Promise<DecodeOutput> {
    const decodeToken = verify(data.token, data.jwtSecret) as DecodeOutput

    return decodeToken
  }
}
