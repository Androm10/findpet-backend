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

  @OneToOne(() => PhotoModel, (photo) => photo.user)
  @JoinColumn()
  avatar: PhotoModel;

  @JoinTable()
  @ManyToMany(() => RoleModel, (role) => role.name)
  roles: RoleModel[];

  @OneToMany(() => AnimalModel, (animal) => animal.user)
  animals: AnimalModel[];

  @IsOptional()
  @ManyToOne(() => ShelterModel, (shelter) => shelter.workers, {
    cascade: false,
  })
  shelter: ShelterModel;

  @JoinTable()
  @ManyToMany(() => AnimalModel, (animal) => animal.favoritedBy)
  favorites: AnimalModel[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password);
  }
}
