import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MACHINE_CLIENTS } from './clients';

@Controller('oauth')
export class AuthController {
  constructor(private readonly jwt: JwtService) {}

  @Post('token')
  @HttpCode(200)
  async token(@Body() body: { grant_type: string; client_id: string; client_secret: string }) {
    if (body.grant_type !== 'client_credentials') {
      throw new BadRequestException('unsupported_grant_type');
    }

    const client = MACHINE_CLIENTS.find(
      (c) => c.clientId === body.client_id && c.clientSecret === body.client_secret,
    );
    if (!client) {
      throw new UnauthorizedException('invalid_client');
    }

    const expiresIn = 900; // 15 minutes
    const accessToken = await this.jwt.signAsync(
      { sub: client.clientId, scope: client.scopes.join(' ') },
      { expiresIn },
    );

    return { access_token: accessToken, token_type: 'Bearer', expires_in: expiresIn, scope: client.scopes.join(' ') };
  }
}