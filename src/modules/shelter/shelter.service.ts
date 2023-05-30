import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SHELTER_REPOSITORY } from 'src/common/constants/tokens';
import { ShelterEntity } from 'src/core/entities/shelter-entity';
import { IShelterRepository } from 'src/core/interfaces/shelter-repository';
import { Coords } from 'src/core/value-objects/coordinates.value-object';
import { PhotoService } from '../photo/photo.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ShelterService {
  constructor(
    @Inject(SHELTER_REPOSITORY)
    private shelterRepository: IShelterRepository,
    private photoService: PhotoService,
    private userService: UserService,
  ) {}

  get(id: number): Promise<ShelterEntity> {
    return this.shelterRepository.get(id);
  }

  getWorkers(id: number) {
    return this.shelterRepository.getWorkers(id);
  }

  getAll(filter: any, limit?: number, page?: number) {
    return this.shelterRepository.getAll(filter, limit, page);
  }

  getByCity(cityId: number, limit?: number, page?: number) {
    return this.shelterRepository.getAll(
      {
        where: {
          city: {
            id: cityId,
          },
        },
      },
      limit,
      page,
    );
  }

  getNearest(coords: Coords, limit?: number, page?: number) {
    return this.shelterRepository.getNearest(coords, limit, page);
  }

  create(data: Omit<ShelterEntity, 'id'>, creatorId: number) {
    return this.shelterRepository.create(data, creatorId);
  }

  async addWorker(id: number, workerEmail: string) {
    const shelter = await this.get(id);

    if (!shelter) {
      throw new BadRequestException('No such shelter');
    }

    const user = await this.userService.getByLogin(workerEmail);

    if (!user) {
      throw new BadRequestException('No such worker');
    }

    if (user.shelterId) {
      throw new BadRequestException('User already a worker');
    }

    return this.shelterRepository.addWorker(id, user.id);
  }

  update(id: number, data: Partial<Omit<ShelterEntity, 'id'>>) {
    return this.shelterRepository.update(id, data);
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

    const shelter = await this.shelterRepository.get(id);
    if (!shelter) {
      throw new BadRequestException('No such shelter');
    }

    return this.photoService.addPhotosToShelter(files, shelter.id);
  }

  delete(id: number) {
    return this.shelterRepository.delete(id);
  }
}
