import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { ShelterModel } from 'src/typeorm/models/shelter.model';
import { ShelterEntity } from 'src/core/entities/shelter-entity';
import { calculatePagination } from 'src/common/utils/calculatePagination';
import { IShelterRepository } from 'src/core/interfaces/shelter-repository';
import { UserModel } from 'src/typeorm/models';
import { RepositoryError } from 'src/common/types/repository-error';

@Injectable()
export class ShelterRepository implements IShelterRepository {
  constructor(
    @InjectRepository(ShelterModel)
    private shelterModel: TypeOrmRepository<ShelterModel>,
  ) {}

  async get(id: number) {
    const shelter = await this.shelterModel.findOne({ where: { id } });
    if (!shelter) return null;
    return new ShelterEntity({ ...shelter, coords: shelter.pointToCoords() });
  }

  async getAll(filter: any, limit?: number, page?: number) {
    const { take, skip } = calculatePagination(limit, page);

    const [shelters, count] = await this.shelterModel.findAndCount({
      ...filter,
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

  async create(data: Omit<ShelterEntity, 'id'>, creatorId?: number) {
    const shelter = this.shelterModel.create({
      ...data,
      coords: data.coords.toPoint(),
    });
    if (creatorId) {
      shelter.workers = [];
      shelter.workers.push({ id: creatorId } as UserModel);
    }
    const created = await this.shelterModel.save(shelter);
    return new ShelterEntity({ ...created, coords: created.pointToCoords() });
  }

  async addWorker(shelterId: number, workerId: number): Promise<ShelterEntity> {
    const shelter = await this.shelterModel.findOne({
      where: { id: shelterId },
    });

    shelter.workers.push({ id: workerId } as UserModel);
    try {
      const updated = await this.shelterModel.save(shelter);
      return new ShelterEntity({ ...updated, coords: updated.pointToCoords() });
    } catch (error) {
      throw new RepositoryError('Cannot add worker', error);
    }
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
