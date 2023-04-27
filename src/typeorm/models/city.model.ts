import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RegionModel } from './region.model';

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

  @ManyToOne(() => RegionModel, (region) => region.cities)
  region: RegionModel;
}
