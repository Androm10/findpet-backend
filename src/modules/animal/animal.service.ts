import { Inject, Injectable } from '@nestjs/common';
import { ANIMAL_REPOSITORY } from 'src/common/constants/tokens';
import { AnimalEntity } from 'src/core/entities/animal-entity';
import { Repository } from 'src/core/interfaces/repository';

@Injectable()
export class AnimalService {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private animalRepository: Repository<AnimalEntity>,
  ) {}

  get(id: number): Promise<AnimalEntity> {
    return this.animalRepository.get(id);
  }

  getAll(): Promise<AnimalEntity[]> {
    return this.animalRepository.getAll();
  }

  create(data: Omit<AnimalEntity, 'id'>): Promise<AnimalEntity> {
    return this.animalRepository.create(data);
  }

  update(
    id: number,
    data: Partial<Omit<AnimalEntity, 'id'>>,
  ): Promise<AnimalEntity> {
    return this.animalRepository.update(id, data);
  }

  delete(id: number): Promise<boolean> {
    return this.animalRepository.delete(id);
  }
}
