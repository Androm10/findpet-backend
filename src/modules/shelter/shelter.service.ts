import { Inject, Injectable } from '@nestjs/common';
import { SHELTER_REPOSITORY } from 'src/common/constants/tokens';
import { ShelterEntity } from 'src/core/entities/shelter-entity';
import { Repository } from 'src/core/interfaces/repository';
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

  create(data: Omit<ShelterEntity, 'id'>): Promise<ShelterEntity> {
    return this.shelterRepository.create(data);
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
