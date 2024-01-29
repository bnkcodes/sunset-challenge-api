import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AllowPublicAccess } from '@/shared/decorators/allow-public-access.decorator'

import { LoginService } from '../use-case/login'
import { LoginServiceOutput } from '../use-case/login/login.service'
import { RegisterService } from '../use-case/register'
import { RegisterOutput } from '../use-case/register/register.service'
import { AuthUserResponseDTO, AuthUserRequestDTO } from './dto/auth-user.dto'
import { RegisterUserRequestDTO, RegisterUserResponseDTO } from './dto/register-user.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginService: LoginService, private readonly registerService: RegisterService) {}

  @Post('login')
  @AllowPublicAccess()
  @ApiOperation({ summary: 'Authenticate account' })
  @ApiResponse({ status: 200, type: AuthUserResponseDTO })
  public async login(@Body() authUserRequestDTO: AuthUserRequestDTO): Promise<LoginServiceOutput> {
    return this.loginService.execute(authUserRequestDTO)
  }

  @Post('register')
  @AllowPublicAccess()
  @ApiOperation({ summary: 'Register an account' })
  @ApiResponse({ status: 201, type: RegisterUserResponseDTO })
  public async register(@Body() registerUserRequestDTO: RegisterUserRequestDTO): Promise<RegisterOutput> {
    delete registerUserRequestDTO.passwordConfirmation
    return this.registerService.execute(registerUserRequestDTO)
  }
}
