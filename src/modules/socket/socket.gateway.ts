import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SendMessageDto } from './dto/send-message.dto';

import { SocketService } from './socket.service';

@WebSocketGateway(8080, { namespace: 'chat', cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private socketService: SocketService) {}

  @WebSocketServer() server: Server;

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authorization;
    if (!token) {
      client.disconnect();
    }
    try {
      const [, parsed] = token.split(' ');
      this.socketService.initializeUser(client, parsed);
    } catch (error) {
      client.disconnect();
    }
  }

  @SubscribeMessage('SEND_MESSAGE')
  async sendMessage(
    @MessageBody() sendMessageDto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.socketService.sendMessage(sendMessageDto, this.server);
    } catch (error) {
      return { event: 'ERROR', data: error.message };
    }
  }

  handleDisconnect(client: Socket) {
    this.socketService.disconnectUser(client);
  }
}
