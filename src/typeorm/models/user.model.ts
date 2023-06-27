import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  BeforeInsert,
  OneToMany,
  JoinTable,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { hashPasword as hash } from 'src/common/utils/bcrypt';
import { RoleModel } from './role.model';
import { IsEmail, IsOptional } from 'class-validator';
import { AnimalModel } from './animal.model';
import { ShelterModel } from './shelter.model';
import { PhotoModel } from './photo.model';
import { ChatModel } from './chat.model';
import { MessageModel } from './message.model';

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail()
  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column()
  isOnline: boolean;

  @Column({ type: 'date' })
  lastOnlineDate: Date;

  @OneToOne(() => PhotoModel, (photo) => photo.user)
  @JoinColumn()
  avatar: PhotoModel;

  @JoinTable()
  @ManyToMany(() => RoleModel, (role) => role.name)
  roles: RoleModel[];

  @JoinTable()
  @ManyToMany(() => ChatModel, (chat) => chat.users)
  chats: ChatModel[];

  @OneToMany(() => MessageModel, (message) => message.user)
  messages: MessageModel[];

  @OneToMany(() => AnimalModel, (animal) => animal.user)
  animals: AnimalModel[];

  @IsOptional()
  @ManyToOne(() => ShelterModel, (shelter) => shelter.workers, {
    cascade: false,
  })
  shelter: ShelterModel;

  @Column({ nullable: true })
  shelterId: number;

  @JoinTable()
  @ManyToMany(() => AnimalModel, (animal) => animal.favoritedBy)
  favorites: AnimalModel[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password);
  }
}
