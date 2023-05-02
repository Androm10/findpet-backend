import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SHELTER_REPOSITORY } from 'src/common/constants/tokens';
import { ShelterEntity } from 'src/core/entities/shelter-entity';
import { IShelterRepository } from 'src/core/interfaces/shelter-repository';

@Injectable()
export class ShelterService {
  constructor(
    @Inject(SHELTER_REPOSITORY)
    private shelterRepository: IShelterRepository,
  ) {}

  get(id: number): Promise<ShelterEntity> {
    return this.shelterRepository.get(id);
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

  create(
    data: Omit<ShelterEntity, 'id'>,
    creatorId: number,
  ): Promise<ShelterEntity> {
    return this.shelterRepository.create(data, creatorId);
  }

  async addWorker(id: number, workerId: number) {
    const shelter = await this.get(id);

    if (!shelter) {
      throw new BadRequestException('No such shelter');
    }

    return this.shelterRepository.addWorker(id, workerId);
  }

  update(
    id: number,
    data: Partial<Omit<ShelterEntity, 'id'>>,
  ): Promise<ShelterEntity> {
    return this.shelterRepository.update(id, data);
  }

  delete(id: number): Promise<boolean> {
    return this.shelterRepository.delete(id);
  }
}
