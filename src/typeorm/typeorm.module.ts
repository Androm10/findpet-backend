import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalModel } from './models/animal.model';
import { RoleModel } from './models/role.model';
import { ShelterModel } from './models/shelter.model';
import { UserModel } from './models/user.model';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get('database.dialect'),
        url: configService.get('database.uri'),
        synchronize: true,
        autoLoadEntities: true,
        entities: [UserModel, RoleModel, AnimalModel, ShelterModel],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppTypeormModule {}
