import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { POST_REPOSITORY } from 'src/common/constants/tokens';
import { PhotoModule } from '../photo/photo.module';
import { UserModule } from '../user/user.module';
import { PostModel } from 'src/typeorm/models/post.model';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { ShelterModule } from '../shelter/shelter.module';

@Module({
  controllers: [PostController],
  imports: [
    TypeOrmModule.forFeature([PostModel]),
    PhotoModule,
    UserModule,
    ShelterModule,
  ],
  providers: [
    PostService,
    {
      provide: POST_REPOSITORY,
      useClass: PostRepository,
    },
  ],
  exports: [PostService],
})
export class PostModule {}
