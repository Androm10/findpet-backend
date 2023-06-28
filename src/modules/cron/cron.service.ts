import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { PostModel } from 'src/typeorm/models/post.model';
import { IsNull, Raw, Repository } from 'typeorm';
import { PhotoService } from '../photo/photo.service';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(PostModel)
    private postModel: Repository<PostModel>,
    private photoService: PhotoService,
  ) {}

  @Cron('* 30 * * * *')
  async handleUnpublishedPosts() {
    const posts = await this.postModel.find({
      where: {
        publishDate: IsNull(),
        creationDate: Raw(
          (alias) => `DATE_SUB(NOW(), INTERVAL :value HOUR ) < ${alias}`,
          {
            value: 2,
          },
        ),
      },
      relations: {
        photos: true,
      },
    });

    posts.forEach((post) => {
      this.photoService.deletePhotos(post.photos.map((p) => p.id));
    });
    await this.postModel.delete(posts.map((p) => p.id));
  }
}
