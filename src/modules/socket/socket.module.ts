import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';
import { MessageModule } from '../message/message.module';
import { UserModule } from '../user/user.module';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [
    ChatModule,
    MessageModule,
    UserModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.secret'),
        signOptions: {
          expiresIn: configService.get<string>('auth.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SocketService, SocketGateway],
})
export class SocketModule {}
