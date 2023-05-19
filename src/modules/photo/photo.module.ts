import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PHOTO_REPOSITORY } from 'src/common/constants/tokens';
import { PhotoModel } from 'src/typeorm/models';
import { MinioModule } from '../minio/minio.module';
import { PhotoRepository } from './photo.repository';
import { PhotoService } from './photo.service';

@Module({
  imports: [MinioModule, TypeOrmModule.forFeature([PhotoModel])],
  providers: [
    PhotoService,
    {
      provide: PHOTO_REPOSITORY,
      useClass: PhotoRepository,
    },
  ],
  exports: [PhotoService],
})
export class PhotoModule {}
