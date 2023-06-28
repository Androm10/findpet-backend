import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from 'src/typeorm/models/post.model';
import { PhotoService } from '../photo/photo.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([PostModel]),
    PhotoService,
  ],
})
export class CronModule {}
