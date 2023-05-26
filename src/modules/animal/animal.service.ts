import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ANIMAL_REPOSITORY } from 'src/common/constants/tokens';
import { AnimalEntity } from 'src/core/entities/animal-entity';
import { IAnimalRepository } from 'src/core/interfaces/animal-repository';
import { Like } from 'typeorm';
import { PhotoService } from '../photo/photo.service';

@Injectable()
export class AnimalService {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private animalRepository: IAnimalRepository,
    private photoService: PhotoService,
  ) {}

  get(id: number) {
    return this.animalRepository.get(id);
  }

  getByShelterId(id: number, limit?: number, page?: number) {
    return this.animalRepository.getAll(
      { where: { shelter: { id } } },
      limit,
      page,
    );
  }

  getByUserId(id: number, limit?: number, page?: number) {
    return this.animalRepository.getAll(
      { where: { user: { id } } },
      limit,
      page,
    );
  }

  getAll(filter?: any, limit?: number, page?: number) {
    const where = {};
    if (filter.name) {
      where['name'] = Like(`%${filter.name}%`);
    }

    if (filter.type) {
      where['type'] = filter.type;
    }

    if (filter.sex) {
      where['sex'] = filter.sex;
    }

    return this.animalRepository.getAll(
      {
        where,

        relations: {
          photos: true,
        },
      },
      limit,
      page,
    );
  }

  create(data: Omit<AnimalEntity, 'id'>) {
    return this.animalRepository.create(data);
  }

  update(id: number, data: Partial<Omit<AnimalEntity, 'id'>>) {
    return this.animalRepository.update(id, data);
  }

  //TODO: add validators for animal in shelter, foreign users
  async addPhotos(id: number, files: Express.Multer.File[]) {
    if (
      files.reduce(
        (acc, file) => acc || !file.mimetype.includes('image'),
        false,
      )
    ) {
      throw new BadRequestException('All files must be images');
    }

    const animal = await this.animalRepository.get(id);
    if (!animal) {
      throw new BadRequestException('No such animal');
    }

    return this.photoService.addPhotosToAnimal(files, animal.id);
  }

  async makeFavorite(id: number, userId: number) {
    const animal = await this.get(id);
    if (!animal) {
      throw new NotFoundException('No such animal');
    }
    this.animalRepository.makeFavorite(id, userId);
  }

  delete(id: number) {
    return this.animalRepository.delete(id);
  }
}
