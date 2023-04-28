import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { Req, Res } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';

import { NoAuth } from 'src/common/decorators/no-auth.decorator';
import { GoogleOAuth2Guard } from './guards/google-oauth.guard';
import { GrantNewTokensDto } from './dto/grant-new-tokens.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { GoogleUser } from './strategies/google-oauth2.strategy';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@ApiTags('auth')
@NoAuth()
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('/grantNewTokens')
  async grantNewTokens(
    @Body() grantNewTokensDto: GrantNewTokensDto,
    @Req() req,
  ) {
    return await this.authService.grantNewTokens(
      grantNewTokensDto.refreshToken,
      req.user.id,
    );
  }

  @UseGuards(GoogleOAuth2Guard)
  @Get('/google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async google() {}

  @UseGuards(GoogleOAuth2Guard)
  @Get('/google-callback')
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user as GoogleUser;
    const token = await this.authService.loginGoogleAuth(user);
    // res.set('authorization', token.accessToken);
    return res.redirect(`http://localhost:3001/login?auth=${token}`);
  }
}
