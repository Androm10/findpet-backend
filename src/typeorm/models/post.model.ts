import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AnimalModel } from './animal.model';
import { PhotoModel } from './photo.model';
import { ShelterModel } from './shelter.model';

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  text: string;

  @Column({ type: Date, nullable: true })
  publishDate: Date | null;

  @Column({ type: Date })
  creationDate: Date;

  @Column()
  isEdited: boolean;

  shelterId: number;

  @ManyToOne(() => ShelterModel, (shelter) => shelter.posts)
  shelter: ShelterModel;

  @OneToMany(() => PhotoModel, (photo) => photo.post, { nullable: true })
  photos: PhotoModel[];

  @JoinTable()
  @ManyToMany(() => AnimalModel, (animal) => animal.posts)
  animals?: AnimalModel[];

  @BeforeInsert()
  onCreate() {
    this.creationDate = new Date();
  }
}
