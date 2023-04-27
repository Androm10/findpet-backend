import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from 'src/core/interfaces/repository';
import { ShelterModel } from 'src/typeorm/models/shelter.model';
import { ShelterEntity } from 'src/core/entities/shelter-entity';
import { calculatePagination } from 'src/common/utils/calculatePagination';

@Injectable()
export class ShelterRepository implements Repository<ShelterEntity> {
  constructor(
    @InjectRepository(ShelterModel)
    private shelterModel: TypeOrmRepository<ShelterModel>,
  ) {}

  async get(id: number) {
    const shelter = await this.shelterModel.findOne({ where: { id } });
    return new ShelterEntity({ ...shelter, coords: shelter.pointToCoords() });
  }

  async getAll(limit?: number, page?: number) {
    const { take, skip } = calculatePagination(limit, page);

    const [shelters, count] = await this.shelterModel.findAndCount({
      take,
      skip,
    });

    const result = {
      result: shelters.map(
        (s) => new ShelterEntity({ ...s, coords: s.pointToCoords() }),
      ),
      limit: take,
      page: page,
      pages: Math.ceil(count / take),
      count,
    };
    return result;
  }

  async create(data: Omit<ShelterEntity, 'id'>) {
    const shelter = await this.shelterModel.create({
      ...data,
      coords: data.coords.toPoint(),
    });
    const created = await this.shelterModel.save(shelter);
    return new ShelterEntity({ ...created, coords: created.pointToCoords() });
  }

  async update(id: number, data: Partial<Omit<ShelterEntity, 'id'>>) {
    await this.shelterModel.update(
      { id },
      {
        ...data,
        coords: data?.coords?.toPoint(),
      },
    );

    return new ShelterEntity({ ...data, id });
  }

  async delete(id: number) {
    await this.shelterModel.delete({ id });
    return true;
  }
}
