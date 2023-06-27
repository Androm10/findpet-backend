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
import { PhotoModel } from './photo.model';
import { PostModel } from './post.model';
import { UserModel } from './user.model';

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

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => PhotoModel, (photo) => photo.shelter, { nullable: true })
  photos: PhotoModel[];

  @OneToMany(() => AnimalModel, (animal) => animal.shelter)
  animals: AnimalModel[];

  @ManyToOne(() => CityModel, (city) => city.shelters)
  city: CityModel;

  @OneToMany(() => UserModel, (user) => user.shelter, { cascade: false })
  workers: UserModel[];

  @OneToMany(() => PostModel, (post) => post.shelter, { cascade: false })
  posts: PostModel[];

  pointToCoords() {
    const spaceIndex = this.coords.indexOf(' ');
    return {
      latitude: Number.parseFloat(this.coords.substring(6, spaceIndex)),
      longitude: Number.parseFloat(this.coords.substring(spaceIndex)),
    } as Coords;
  }
}
