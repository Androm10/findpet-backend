import { IsOptional } from 'class-validator';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShelterModel } from './shelter.model';
import { UserModel } from './user.model';

@Entity()
export class AnimalModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @IsOptional()
  @Column({ nullable: true })
  description?: string;

  @Column()
  age: number;

  @IsOptional()
  @Column({ nullable: true, type: 'date' })
  orphanageDate?: Date;

  @ManyToOne(() => ShelterModel, (shelter) => shelter.animals, {
    nullable: true,
    cascade: true,
  })
  shelter: ShelterModel;

  @ManyToOne(() => UserModel, (user) => user.animals, {
    nullable: true,
  })
  user?: UserModel;

  @ManyToMany(() => UserModel, (user) => user.favorites)
  favoritedBy: UserModel[];
}
