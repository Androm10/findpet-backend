import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { PostModel } from 'src/typeorm/models/post.model';
import { IsNull, Raw, Repository } from 'typeorm';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(PostModel)
    private postModel: Repository<PostModel>,
  ) {}

  @Cron('* 30 * * * *')
  handleUnpublishedPosts() {
    this.postModel.delete({
      publishDate: IsNull(),
      creationDate: Raw(
        (alias) => `DATE_SUB(NOW(), INTERVAL :value HOUR ) < ${alias}`,
        {
          value: 2,
        },
      ),
    });
  }
}
