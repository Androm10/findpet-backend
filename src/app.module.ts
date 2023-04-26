import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';

import { ModulesModule } from './modules/modules.module';
import { AppTypeormModule } from './typeorm/typeorm.module';

@Module({
  imports: [
    AppTypeormModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENVIRONMENT}.env`,
      load: [config, databaseConfig, authConfig],
      isGlobal: true,
    }),
    ModulesModule,
  ],
})
export class AppModule {}
