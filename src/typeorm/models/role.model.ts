import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { UserModel } from './user.model';

@Entity()
export class RoleModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany((type) => UserModel, (user) => user.roles, {
    nullable: true,
  })
  @JoinTable()
  users: UserModel[];
}
