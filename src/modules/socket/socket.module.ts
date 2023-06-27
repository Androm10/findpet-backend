import { Module } from '@nestjs/common';
import { ChatModule } from '../chat/chat.module';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [ChatModule],
  providers: [SocketService, SocketGateway],
})
export class SocketModule {}
