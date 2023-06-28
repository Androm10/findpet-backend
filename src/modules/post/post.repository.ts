import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Not, Repository as TypeOrmRepository } from 'typeorm';
import { PostEntity } from 'src/core/entities/post-entity';
import { IPostRepository } from 'src/core/interfaces/post-repository';
import { Paginated } from 'src/core/interfaces/repository';
import { PostModel } from 'src/typeorm/models/post.model';
import { calculatePagination } from 'src/common/utils/calculatePagination';

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(
    @InjectRepository(PostModel)
    private postModel: TypeOrmRepository<PostModel>,
  ) {}

  async get(id: number) {
    const post = await this.postModel.findOne({
      where: { id, publishDate: Not(null) },
    });

    return new PostEntity(post);
  }

  async getAny(id: number) {
    const post = await this.postModel.findOne({
      where: { id },
      relations: {
        photos: true,
        shelter: true,
      },
    });
    return new PostEntity(post);
  }

  async getAll(filter: any, limit?: number, page?: number) {
    const { take, skip } = calculatePagination(limit, page);

    const where: any = {
      publishDate: Not(null),
    };

    if (filter.animals && filter.animals.length) {
      where.animals = {
        id: In(where.animals),
      };
    }

    if (filter.name) {
      where.name = Like(`%${filter.name}%`);
    }

    if (filter.text) {
      where.text = Like(`%${filter.text}%`);
    }

    if (filter.shelterId) {
      where.shelterId = filter.shelterId;
    }

    const [posts, count] = await this.postModel.findAndCount({
      where,
      relations: {
        photos: true,
        shelter: true,
        animals: true,
      },
      take,
      skip,
    });

    const result = {
      result: posts.map((s) => new PostEntity(s)),
      limit: take,
      page: page,
      pages: Math.ceil(count / take),
      count,
    };
    return result;
  }

  async create(data: Omit<PostEntity, 'id'>) {
    const post = this.postModel.create({
      text: data.text,
      name: data.name,
      animals: data.animals,
      shelterId: data.shelterId,
      isEdited: false,
      publishDate: null,
    });
    const created = await this.postModel.save(post);

    return new PostEntity(created);
  }

  async update(id: number, data: Partial<Omit<PostEntity, 'id'>>) {
    const updated = await this.postModel.update(
      {
        id,
      },
      {
        text: data.text,
        name: data.name,
        animals: data.animals,
        isEdited: data.isEdited,
        publishDate: data.publishDate,
      },
    );

    return new PostEntity({ ...data, id });
  }

  async delete(id: number) {
    await this.postModel.delete({ id });
    return true;
  }
}
