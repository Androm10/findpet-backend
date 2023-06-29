import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AnimalModel } from './animal.model';
import { PostModel } from './post.model';
import { ShelterModel } from './shelter.model';
import { UserModel } from './user.model';

@Entity()
export class PhotoModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: '2083' })
  url: string;

  @ManyToOne(() => AnimalModel, (animal) => animal.photos, { nullable: true })
  animal: AnimalModel;

  @ManyToOne(() => ShelterModel, (shelter) => shelter.photos, {
    nullable: true,
  })
  shelter: ShelterModel;

  @ManyToOne(() => PostModel, (post) => post.photos, {
    nullable: true,
  })
  post: PostModel;

  @OneToOne(() => UserModel, (user) => user.avatar, { nullable: true })
  user: UserModel;
}
