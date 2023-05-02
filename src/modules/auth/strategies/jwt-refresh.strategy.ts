import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { Request } from 'express';
import { Cache } from 'cache-manager';

import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {
    super({
      secretOrKey: configService.get<string>('auth.refreshSecret'),
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<any> {
    const id = payload.userId;
    const { refreshToken } = req.body;

    const cachedToken = await this.cacheService.get(id.toString());

    if (cachedToken !== refreshToken) {
      throw new ForbiddenException('Invalid token, not equal to existing');
    }

    const user = await this.authService.validateUser(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
