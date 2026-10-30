import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ScopesGuard } from './scopes.guard';


@Module({
  imports: [
    JwtModule.register({
      global: true,                                            // JwtService available everywhere
      secret: process.env.JWT_SECRET ?? 'dev-only-change-me',  // from a secrets manager in production
    }),
  ],
  controllers: [AuthController],
  providers: [ScopesGuard],
  exports: [ScopesGuard],  
})
export class AuthModule {}