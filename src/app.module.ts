import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config';
import databaseConfig from './config/database.config';

import { ModulesModule } from './modules/modules.module';
import { AppSequelizeModule } from './sequelize/sequelize.module';

@Module({
  imports: [
    AppSequelizeModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENVIRONMENT}.env`,
      load: [config, databaseConfig],
      isGlobal: true,
    }),
    ModulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
