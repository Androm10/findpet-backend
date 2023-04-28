import { IsEmail, IsOptional, IsUrl, Length } from 'class-validator';
import { Coords } from 'src/core/value-objects/coordinates.value-object';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AnimalModel } from './animal.model';
import { CityModel } from './city.model';

@Entity()
export class ShelterModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Length(3, 100)
  @Column()
  name: string;

  @Column({ type: 'point' })
  coords: string;

  @IsOptional()
  @Column({ nullable: true })
  description?: string;

  @IsOptional()
  @Column({ nullable: true })
  contactPhone?: string;

  @IsOptional()
  @IsEmail()
  @Column({ nullable: true })
  contactEmail?: string;

  @IsOptional()
  @IsUrl()
  @Column({ nullable: true })
  contactUrl?: string;

  @OneToMany(() => AnimalModel, (animal) => animal.shelter)
  animals: AnimalModel[];

  @ManyToOne(() => CityModel, (city) => city.shelters)
  city: CityModel;

  pointToCoords() {
    const spaceIndex = this.coords.indexOf(' ');
    return {
      latitude: Number.parseFloat(this.coords.substring(6, spaceIndex)),
      longitude: Number.parseFloat(this.coords.substring(spaceIndex)),
    } as Coords;
  }
}
