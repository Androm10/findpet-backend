import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from 'src/typeorm/models/post.model';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([PostModel])],
})
export class CronModule {}
