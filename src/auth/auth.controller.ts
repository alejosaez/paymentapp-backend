import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate')
  async validateAndHandleUser(
    @Body() body: { token: string; email: string; username: string },
  ) {
    const { token, email, username } = body;
    const decoded = await this.authService.validateToken(token);

    const user = await this.authService.handleUser(email, username);

    return { user, decoded };
  }
}
