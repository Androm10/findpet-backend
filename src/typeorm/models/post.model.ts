import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AnimalModel } from './animal.model';
import { PhotoModel } from './photo.model';
import { ShelterModel } from './shelter.model';
import { UserModel } from './user.model';

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  text: string;

  shelterId: number;

  @ManyToOne(() => ShelterModel, (shelter) => shelter.posts)
  shelter: ShelterModel;

  @OneToMany(() => PhotoModel, (photo) => photo.post, { nullable: true })
  photos: PhotoModel[];

  @JoinTable()
  @ManyToMany(() => AnimalModel, (animal) => animal.posts)
  animals?: AnimalModel[];
}
