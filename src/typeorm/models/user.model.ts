import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  BeforeInsert,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { hashPasword as hash } from 'src/common/utils/bcrypt';
import { RoleModel } from './role.model';
import { IsEmail } from 'class-validator';
import { AnimalModel } from './animal.model';

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

  @JoinTable()
  @ManyToMany(() => RoleModel, (role) => role.name)
  roles: RoleModel[];

  @OneToMany(() => AnimalModel, (animal) => animal.user)
  animals: AnimalModel[];

  @JoinTable()
  @ManyToMany(() => AnimalModel, (animal) => animal.favoritedBy)
  favorites: AnimalModel[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password);
  }
}
