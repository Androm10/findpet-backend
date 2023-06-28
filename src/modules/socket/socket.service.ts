import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from '../chat/chat.service';
import { UserService } from '../user/user.service';
import { Socket, Server } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageService } from '../message/message.service';
import { StartChatDto } from './dto/start-chat.dto';

@Injectable()
export class SocketService {
  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
    private messageService: MessageService,
    private userService: UserService,
  ) {}

  users: Map<number, Socket> = new Map();

  async initializeUser(client: Socket, token: string) {
    try {
      const payload: any = this.jwtService.decode(token);

      if (payload.refresh || !payload.userId) {
        throw new WsException('Invalid token');
      }

      this.users.set(Number(payload.userId), client);

      const chats = await this.chatService.getUserChats(Number(payload.userId));

      chats.forEach((c) => {
        client.join(String(c.id));
      });

      this.userService.update(Number(payload.userId), {
        isOnline: true,
        lastOnlineDate: new Date(),
      });
    } catch (error) {
      throw new WsException('Invalid token');
    }
  }

  async sendMessage(message: SendMessageDto, server: Server) {
    const { chatId, userId, text } = message;
    const client = this.users.get(userId);
    if (!client) {
      throw new WsException('Cannot find user with such id');
    }

    const chat = await this.chatService.get(chatId, userId);
    if (!chat) {
      throw new WsException('No such chat');
    }

    const msg = await this.messageService.create({ text, chatId, userId });

    server.to(chatId.toString()).emit('NEW_MESSAGE', msg);
  }

  async startChat(data: StartChatDto, server: Server) {
    const { hostId, userId, text } = data;
    const client = this.users.get(hostId);
    if (!client) {
      throw new WsException('Cannot find user with such id');
    }

    const user = await this.userService.get(userId);
    if (!user) {
      throw new WsException(`User with id ${userId} does not exists`);
    }
    let chat = await this.chatService.getChatsByUsers([hostId, userId])[0];
    if (!chat) {
      chat = await this.chatService.create({ users: [hostId, userId] });
    }
    const message = await this.messageService.create({
      text,
      userId: hostId,
      chatId: chat.id,
    });

    client.join(String(chat.id));
    const otherClient = this.users.get(userId);
    if (otherClient) {
      otherClient.join(String(chat.id));
      otherClient.emit('NEW_CHAT', chat);
    }

    server.to(String(chat.id)).emit('NEW_MESSAGE', message);
  }

  disconnectUser(client: Socket) {
    for (const key of this.users.keys()) {
      if (this.users.get(key).id !== client.id) continue;
      this.userService.update(key, { isOnline: false });
      return this.users.delete(key);
    }
  }
}
