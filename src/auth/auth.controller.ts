import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDTO } from './auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private authService: AuthService;

  constructor(service: AuthService) {
    this.authService = service;
  }

  @Post('/signup')
  public signup(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.authService.signUp(authCredentialsDTO);
  }
}
