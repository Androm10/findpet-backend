import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { redisStore } from 'cache-manager-redis-yet';

import config from './config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import minioConfig from './config/minio.config';
import redisConfig from './config/redis.config';
import throttlerConfig from './config/throttler.config';

import { ModulesModule } from './modules/modules.module';
import { AppTypeormModule } from './typeorm/typeorm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENVIRONMENT}.env`,
      load: [
        config,
        databaseConfig,
        authConfig,
        throttlerConfig,
        redisConfig,
        minioConfig,
      ],
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        limit: configService.get<number>('throttler.limit'),
        ttl: configService.get<number>('throttler.ttl'),
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: await redisStore({
          url: `redis://:@${configService.get<string>(
            'redis.host',
          )}:${configService.get<number>('redis.port')}/0`,
          ttl: 4000,
        }),
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),
    AppTypeormModule,
    ModulesModule,
  ],
})
export class AppModule {}
