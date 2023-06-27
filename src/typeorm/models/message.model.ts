import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatModel } from './chat.model';
import { UserModel } from './user.model';

@Entity()
export class MessageModel {
  @PrimaryGeneratedColumn()
  id: number;

  userId: number;

  @ManyToOne(() => UserModel, (user) => user.messages)
  user: UserModel;

  chatId: number;

  @ManyToOne(() => ChatModel, (chat) => chat.messages)
  chat: ChatModel;

  @Column()
  text: string;

  @Column()
  date: Date;
}
