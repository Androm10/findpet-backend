import { Module } from '@nestjs/common';
import { AnimalModule } from './animal/animal.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { CronModule } from './cron/cron.module';
import { MessageModule } from './message/message.module';
import { PostModule } from './post/post.module';
import { ShelterModule } from './shelter/shelter.module';
import { SocketModule } from './socket/socket.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    ShelterModule,
    AnimalModule,
    AuthModule,
    ChatModule,
    MessageModule,
    SocketModule,
    PostModule,
    CronModule,
  ],
  exports: [
    UserModule,
    ShelterModule,
    AnimalModule,
    AuthModule,
    ChatModule,
    MessageModule,
    SocketModule,
    PostModule,
    CronModule,
  ],
})
export class ModulesModule {}
