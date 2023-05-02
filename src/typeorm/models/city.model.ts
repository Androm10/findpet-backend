import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RegionModel } from './region.model';
import { ShelterModel } from './shelter.model';

@Entity()
export class CityModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  stateOrProvince: string;

  @Column()
  country: string;

  @OneToMany(() => ShelterModel, (shelter) => shelter.city)
  shelters: ShelterModel[];

  @ManyToOne(() => RegionModel, (region) => region.cities)
  region: RegionModel;
}
