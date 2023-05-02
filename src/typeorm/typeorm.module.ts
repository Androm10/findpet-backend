import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AnimalModel,
  CityModel,
  PhotoModel,
  RegionModel,
  RoleModel,
  ShelterModel,
  UserModel,
} from './models';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get('database.dialect'),
        url: configService.get('database.uri'),
        synchronize: true,
        autoLoadEntities: true,
        entities: [
          AnimalModel,
          CityModel,
          RegionModel,
          RoleModel,
          ShelterModel,
          UserModel,
          PhotoModel,
        ],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppTypeormModule {}
