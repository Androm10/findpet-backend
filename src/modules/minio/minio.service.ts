import { Injectable, OnModuleInit, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as uuid from 'uuid';
import * as Minio from 'minio';
import { BucketNames } from 'src/common/constants/buckets';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: 'minio',
      port: +this.configService.get('minio.port'),
      useSSL: this.configService.get<boolean>('minio.useSSL'),
      accessKey: this.configService.get('minio.accessKey'),
      secretKey: this.configService.get('minio.secretKey'),
    });
  }

  onModuleInit() {
    this.createBuckets();
  }

  async createBuckets(): Promise<void> {
    Object.keys(BucketNames).forEach(async (bucketName) => {
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
      }
    });
  }

  async uploadFile(file: Express.Multer.File, bucketName: BucketNames) {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = uuid.v4() + file.originalname + '.' + fileExtension;
    await this.minioClient.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
    );
    return fileName;
  }

  getFile(fileName: string, bucketName: BucketNames) {
    return this.minioClient.presignedUrl('GET', bucketName, fileName);
  }

  async downloadFile(fileName: string, bucketName: BucketNames) {
    const fileURL = await this.minioClient.getObject(bucketName, fileName);

    return new StreamableFile(fileURL);
  }

  async deleteFile(fileName: string, bucketName: BucketNames) {
    return await this.minioClient.removeObject(bucketName, fileName);
  }
}
