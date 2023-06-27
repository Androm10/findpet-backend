import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { BucketNames } from 'src/common/constants/buckets';
import {
  POST_REPOSITORY,
  SHELTER_REPOSITORY,
} from 'src/common/constants/tokens';
import { AnimalEntity } from 'src/core/entities/animal-entity';
import { PostEntity } from 'src/core/entities/post-entity';
import { ShelterEntity } from 'src/core/entities/shelter-entity';
import { IPostRepository } from 'src/core/interfaces/post-repository';
import { IShelterRepository } from 'src/core/interfaces/shelter-repository';
import { Coords } from 'src/core/value-objects/coordinates.value-object';
import { PhotoService } from '../photo/photo.service';
import { ShelterService } from '../shelter/shelter.service';
import { UserService } from '../user/user.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @Inject(POST_REPOSITORY)
    private postRepository: IPostRepository,
    private photoService: PhotoService,
    private shelterService: ShelterService,
    private userService: UserService,
  ) {}

  get(id: number) {
    return this.postRepository.get(id);
  }

  getAny(id: number) {
    return this.postRepository.get(id);
  }

  getAll(filter: any, limit?: number, page?: number) {
    return this.postRepository.getAll(filter, limit, page);
  }

  create(data: CreatePostDto) {
    const post = {
      ...data,
      isEdited: false,
      publishDate: null,
      animals: data.animals.map((a) => ({ id: a })) as AnimalEntity[],
    };

    return this.postRepository.create(post);
  }

  async publish(id: number) {
    const post = await this.postRepository.get(id);
    if (!post || post.publishDate == null) {
      throw new BadRequestException('No such post');
    }

    return this.postRepository.update(id, {
      publishDate: new Date(),
      isEdited: false,
    });
  }

  async update(id: number, userId: number, data: UpdatePostDto) {
    const existing = await this.getAny(id);

    if (!existing) {
      throw new BadRequestException('No such post');
    }

    const workers = await this.shelterService.getWorkers(existing.shelterId);
    if (!workers.find((w) => w.id == userId)) {
      throw new ForbiddenException('Not worker');
    }

    const post = {
      ...data,
      animals: data.animals.map((a) => ({ id: a })) as AnimalEntity[],
      isEdited: true,
    };

    return this.postRepository.update(id, post);
  }

  async addPhotos(id: number, files: Express.Multer.File[]) {
    if (
      files.reduce(
        (acc, file) => acc || !file.mimetype.includes('image'),
        false,
      )
    ) {
      throw new BadRequestException('All files must be images');
    }

    const post = await this.postRepository.get(id);
    if (!post) {
      throw new BadRequestException('No such post');
    }

    return this.photoService.addPhotos(files, post.id, BucketNames.POST_BUCKET);
  }

  delete(id: number) {
    return this.postRepository.delete(id);
  }
}
