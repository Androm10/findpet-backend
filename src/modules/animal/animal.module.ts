import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ANIMAL_REPOSITORY } from 'src/common/constants/tokens';
import { AnimalModel } from 'src/typeorm/models/animal.model';
import { PhotoModule } from '../photo/photo.module';
import { ShelterModule } from '../shelter/shelter.module';
import { AnimalController } from './animal.controller';
import { AnimalRepository } from './animal.repository';
import { AnimalService } from './animal.service';

@Module({
  controllers: [AnimalController],
  imports: [
    TypeOrmModule.forFeature([AnimalModel]),
    ShelterModule,
    PhotoModule,
  ],
  providers: [
    AnimalService,
    {
      provide: ANIMAL_REPOSITORY,
      useClass: AnimalRepository,
    },
  ],
  exports: [AnimalService],
})
export class AnimalModule {}
