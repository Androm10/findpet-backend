import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  constructor(private minioClient: Minio.Client) {}
}
