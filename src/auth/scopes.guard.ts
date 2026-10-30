import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

// A decorator to label a route with the scopes it needs, e.g. @RequireScopes('reservations:write')
export const SCOPES_KEY = 'scopes';
export const RequireScopes = (...scopes: string[]) => SetMetadata(SCOPES_KEY, scopes);

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Read "Authorization: Bearer <token>"
    const [type, token] = (request.headers.authorization ?? '').split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    // 2. Check signature and expiry
    let payload: { sub: string; scope: string };
    try {
      payload = await this.jwt.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // 3. Check the route's required scopes
    const required = this.reflector.getAllAndOverride<string[]>(SCOPES_KEY, [context.getHandler(), context.getClass()]) ?? [];
    const granted = payload.scope.split(' ');
    if (!required.every((s) => granted.includes(s))) {
      throw new ForbiddenException(`Requires scope: ${required.join(', ')}`);
    }

    request.client = payload.sub;   // who called, for the audit trail
    return true;
  }
}