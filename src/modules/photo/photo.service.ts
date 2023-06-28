import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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

  async updateUserAvatar(userId: number, file: Express.Multer.File) {
    const name = await this.minioService.uploadFile(
      file,
      BucketNames.USER_BUCKET,
    );
    const url = `http://localhost:9000/${BucketNames.USER_BUCKET}/${name}`;

    const uploadedPhotos = [
      {
        name: file.originalname,
        url,
        user: { id: userId },
      },
    ];

    return this.photoRepository.bulkCreate(uploadedPhotos);
  }

  async addPhotos(
    files: Express.Multer.File[],
    id: number,
    entityName: BucketNames,
  ) {
    const uploadedPhotos = await Promise.all(
      files.map(async (file) => {
        const name = await this.minioService.uploadFile(file, entityName);
        const url = `http://localhost:9000/${entityName}/${name}`;

        return {
          name: file.originalname,
          url,
          [entityName]: { id },
        };
      }),
    );

    return this.photoRepository.bulkCreate(uploadedPhotos);
  }

  //TODO: fix 2 requests
  async addPhotosToShelter(files: Express.Multer.File[], shelterId: number) {
    const uploadedPhotos = await Promise.all(
      files.map(async (file) => {
        const name = await this.minioService.uploadFile(
          file,
          BucketNames.SHELTER_BUCKET,
        );
        const url = `http://localhost:9000/${BucketNames.SHELTER_BUCKET}/${name}`;
        // await this.minioService.getFile(
        //   name,
        //   BucketNames.SHELTER_BUCKET,
        // );

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
        const url = `http://localhost:9000/${BucketNames.ANIMAL_BUCKET}/${name}`;

        return {
          name: file.originalname,
          url,
          animal: { id: animalId },
        };
      }),
    );

    return this.photoRepository.bulkCreate(uploadedPhotos);
  }

  async updatePhoto(file: Express.Multer.File, photoId: number) {
    const photo = await this.photoRepository.get(photoId);
    if (!photo) {
      throw new BadRequestException('no such photo');
    }

    const { fileName, bucketName } = this.parseUrl(photo.url);

    await this.minioService.deleteFile(fileName, bucketName);
    const newName = await this.minioService.uploadFile(
      file,
      bucketName as BucketNames,
    );
    const newUrl = `http://localhost:9000/${bucketName}/${newName}`;
    return await this.photoRepository.update(photo.id, {
      name: newName,
      url: newUrl,
    });
  }

  async deletePhoto(photoId: number) {
    const photo = await this.photoRepository.get(photoId);
    if (!photo) {
      throw new BadRequestException('no such photo');
    }

    const { fileName, bucketName } = this.parseUrl(photo.url);

    await this.minioService.deleteFile(fileName, bucketName);
    await this.photoRepository.delete(photoId);
    return true;
  }

  async deletePhotos(photoIds: number[]) {
    return this.photoRepository.bulkDelete(photoIds);
  }

  private parseUrl(url: string) {
    try {
      const nameSeparatorIndex = url.lastIndexOf('/');
      const fileName = url.substring(nameSeparatorIndex);
      const bucketName = url.substring(
        url.lastIndexOf('/', nameSeparatorIndex - 1),
      ) as BucketNames;
      return { fileName, bucketName };
    } catch (error) {
      return {};
    }
  }
}
