import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserService } from 'src/modules/user/user.service';
import { SignupDto } from './dto/signup.dto';
import { comparePassword } from 'src/common/utils/bcrypt';
import { LoginDto } from './dto/login.dto';
import { GoogleUser } from './strategies/google-oauth2.strategy';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async validateUser(id: number) {
    try {
      const user = await this.userService.get(id);
      return user;
    } catch (error) {
      return null;
    }
  }

  async signup(signupDto: SignupDto) {
    if (await this.userService.getByLogin(signupDto.login)) {
      throw new BadRequestException('User with such login already exists');
    }

    return await this.userService.registerUser(signupDto);
  }

  async loginGoogleAuth(user: GoogleUser) {
    if (!user || !user.email || !user.name) {
      throw new BadRequestException('not authenticated');
    }

    let found = await this.userService.getByLogin(user.email);

    if (!found) {
      // TODO: generate random password for google user
      found = await this.signup({
        login: user.email,
        password: user.email,
        confirmPassword: user.email,
        username: user.name,
      });
    }

    const { accessToken, refreshToken } = await this.generateTokens(found.id);

    return {
      accessToken,
      refreshToken,
      accessExpiresIn: this.configService.get<string>('auth.expiresIn'),
      refreshExpiresIn: this.configService.get<string>('auth.refreshExpiresIn'),
    };
  }

  async login(user: LoginDto) {
    const found = await this.userService.getByLogin(user.login);

    if (found?.login != user.login) {
      throw new BadRequestException('Login or password is incorrect');
    }
    if (!comparePassword(user.password, found.password)) {
      throw new BadRequestException('Login or password is incorrect');
    }

    const { accessToken, refreshToken } = await this.generateTokens(found.id);

    return {
      accessToken,
      refreshToken,
      accessExpiresIn: this.configService.get<string>('auth.expiresIn'),
      refreshExpiresIn: this.configService.get<string>('auth.refreshExpiresIn'),
    };
  }

  async grantNewTokens(refreshToken: string) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get('auth.refreshSecret'),
      });
    } catch (error) {
      throw new ForbiddenException('Invalid token, cannot verify');
    }

    const payload: any = this.jwtService.decode(refreshToken);

    const cachedToken = await this.cacheService.get(payload.userId);

    if (cachedToken !== refreshToken) {
      throw new ForbiddenException('Invalid token, not equal to existing');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(payload.userId);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      accessExpiresIn: this.configService.get<string>('auth.expiresIn'),
      refreshExpiresIn: this.configService.get<string>('auth.refreshExpiresIn'),
    };
  }

  private async generateTokens(userId: number) {
    const refreshExpiresIn = this.configService.get<number>(
      'auth.refreshExpiresIn',
    );

    const accessToken = this.jwtService.sign({
      userId: userId,
    });

    const refreshToken = this.jwtService.sign(
      {
        userId: userId,
        refresh: true,
      },
      {
        expiresIn: refreshExpiresIn / 100,
      },
    );

    this.cacheService.set(userId.toString(), refreshToken, refreshExpiresIn);

    return {
      accessToken,
      refreshToken,
    };
  }
}
