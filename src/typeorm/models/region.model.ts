import { IsOptional } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CityModel } from './city.model';

@Entity()
export class RegionModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @IsOptional()
  @Column()
  description?: string;

  @OneToMany(() => CityModel, (city) => city.region)
  cities: CityModel[];
}
