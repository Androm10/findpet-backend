import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AnimalModel } from './animal.model';
import { ShelterModel } from './shelter.model';

@Entity()
export class PhotoModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToOne(() => AnimalModel, (animal) => animal.photos, { nullable: true })
  animal: AnimalModel;

  @ManyToOne(() => ShelterModel, (shelter) => shelter.photos, {
    nullable: true,
  })
  shelter: ShelterModel;
}
