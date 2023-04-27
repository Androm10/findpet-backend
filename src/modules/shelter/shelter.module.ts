import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SHELTER_REPOSITORY } from 'src/common/constants/tokens';
import { ShelterModel } from 'src/typeorm/models/shelter.model';
import { ShelterController } from './shelter.controller';
import { ShelterRepository } from './shelter.repository';
import { ShelterService } from './shelter.service';

@Module({
  controllers: [ShelterController],
  imports: [TypeOrmModule.forFeature([ShelterModel])],
  providers: [
    ShelterService,
    {
      provide: SHELTER_REPOSITORY,
      useClass: ShelterRepository,
    },
  ],
  exports: [ShelterService],
})
export class ShelterModule {}