import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AllowPublicAccess } from '@/shared/decorators/allow-public-access.decorator'

import { LoginService } from '../use-case/login'
import { LoginServiceOutput } from '../use-case/login/login.service'
import { RegisterService } from '../use-case/register'
import { RegisterOutput } from '../use-case/register/register.service'
import { LoginDTO } from './dto/login.dto'
import { RegisterDTO } from './dto/register.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginService: LoginService, private readonly registerService: RegisterService) {}

  @AllowPublicAccess()
  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  public async login(@Body() body: LoginDTO): Promise<LoginServiceOutput> {
    return this.loginService.execute(body)
  }

  @AllowPublicAccess()
  @Post('register')
  @ApiOperation({ summary: 'Register User' })
  public async register(@Body() body: RegisterDTO): Promise<RegisterOutput> {
    delete body.passwordConfirmation
    return this.registerService.execute(body)
  }
}
