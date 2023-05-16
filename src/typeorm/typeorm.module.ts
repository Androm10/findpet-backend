import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
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
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppTypeormModule {}
