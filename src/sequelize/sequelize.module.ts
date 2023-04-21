import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { SEQUELIZE } from 'src/common/constants/tokens';
import { UserModel } from './models/user.model';
import { sequelizeProviders } from './providers';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        // ...configService.get('database'),
        uri: configService.get('database.uri'),
        models: [UserModel],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [...sequelizeProviders],
  exports: [SequelizeModule, SEQUELIZE],
})
export class AppSequelizeModule {}
