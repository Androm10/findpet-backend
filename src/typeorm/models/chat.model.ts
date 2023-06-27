import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageModel } from './message.model';
import { UserModel } from './user.model';

@Entity()
export class ChatModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => UserModel, (user) => user.chats)
  users: UserModel[];

  @OneToMany(() => MessageModel, (message) => message.chat)
  messages: MessageModel[];
}
