import { Inject, Injectable } from '@nestjs/common';
import { BucketNames } from 'src/common/constants/buckets';
import { PHOTO_REPOSITORY } from 'src/common/constants/tokens';
import { IPhotoRepository } from 'src/core/interfaces/photo-repository';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class PhotoService {
  constructor(
    private minioService: MinioService,
    @Inject(PHOTO_REPOSITORY) private photoRepository: IPhotoRepository,
  ) {}

  //TODO: fix 2 requests
  async addPhotosToShelter(files: Express.Multer.File[], shelterId: number) {
    const uploadedPhotos = await Promise.all(
      files.map(async (file) => {
        const name = await this.minioService.uploadFile(
          file,
          BucketNames.SHELTER_BUCKET,
        );
        const url = await this.minioService.getFile(
          name,
          BucketNames.SHELTER_BUCKET,
        );

        return {
          name: file.originalname,
          url,
          shelter: { id: shelterId },
        };
      }),
    );

    return this.photoRepository.bulkCreate(uploadedPhotos);
  }

  async addPhotosToAnimal(files: Express.Multer.File[], animalId: number) {
    const uploadedPhotos = await Promise.all(
      files.map(async (file) => {
        const name = await this.minioService.uploadFile(
          file,
          BucketNames.ANIMAL_BUCKET,
        );
        const url = await this.minioService.getFile(
          name,
          BucketNames.ANIMAL_BUCKET,
        );

        return {
          name: file.originalname,
          url,
          animal: { id: animalId },
        };
      }),
    );

    return this.photoRepository.bulkCreate(uploadedPhotos);
  }
}
