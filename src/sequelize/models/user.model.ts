import {
  Column,
  Model,
  Table,
  BeforeCreate,
  BeforeUpdate,
  AllowNull,
  IsEmail,
  Unique,
} from 'sequelize-typescript';

import { hashPasword as hash } from 'src/common/utils/bcrypt';

@Table
export class UserModel extends Model {
  @AllowNull(false)
  @IsEmail
  @Unique
  @Column
  login: string;

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull(false)
  @Column
  username: string;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: UserModel) {
    instance.password = await hash(instance.password);
  }
}
