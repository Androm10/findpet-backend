import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository as TypeOrmRepository } from 'typeorm';
import { ShelterModel } from 'src/typeorm/models/shelter.model';
import { ShelterEntity } from 'src/core/entities/shelter-entity';
import { calculatePagination } from 'src/common/utils/calculatePagination';
import { IShelterRepository } from 'src/core/interfaces/shelter-repository';
import { UserModel } from 'src/typeorm/models';
import { RepositoryError } from 'src/common/types/repository-error';
import { Coords } from 'src/core/value-objects/coordinates.value-object';
import { UserEntity } from 'src/core/entities/user-entity';

@Injectable()
export class ShelterRepository implements IShelterRepository {
  constructor(
    @InjectRepository(ShelterModel)
    private shelterModel: TypeOrmRepository<ShelterModel>,
    private dataSource: DataSource,
  ) {}

  async get(id: number) {
    const shelter = await this.shelterModel.findOne({
      where: { id },
      relations: {
        photos: true,
      },
    });
    if (!shelter) return null;
    return new ShelterEntity({ ...shelter, coords: shelter.pointToCoords() });
  }

  async getWorkers(id: number) {
    const shelter = await this.shelterModel.findOne({
      where: { id },
      relations: { workers: true },
    });
    if (!shelter) {
      throw new RepositoryError('No such shelter');
    }

    const workers = shelter.workers;

    return workers.map((w) => new UserEntity(w));
  }

  async getAll(filter: any, limit?: number, page?: number) {
    const { take, skip } = calculatePagination(limit, page);

    const [shelters, count] = await this.shelterModel.findAndCount({
      ...filter,
      relations: {
        photos: true,
      },
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

  //TODO: calculate correct distance
  async getNearest(coords: Coords, limit?: number, page?: number) {
    const { take, skip } = calculatePagination(limit, page);

    const [shelters, count] = await this.dataSource
      .getRepository(ShelterModel)
      .createQueryBuilder('shelter')
      .select([
        'shelter',
        `ST_Length(LineString(shelter.coords, ST_GeomFromText("POINT(${coords.longitude} ${coords.latitude})"))) as distance`,
      ])
      .orderBy('distance', 'ASC')
      .take(take)
      .skip(skip)
      .getManyAndCount();

    console.log(shelters, count);

    return {
      result: shelters.map(
        (s) => new ShelterEntity({ ...s, coords: s.pointToCoords() }),
      ),
      limit: take,
      page: page,
      pages: Math.ceil(count / take),
      count: count,
    };
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

  async addWorker(shelterId: number, workerId: number) {
    const shelter = await this.shelterModel.findOne({
      where: { id: shelterId },
      relations: { workers: true },
    });

    if (!shelter.workers.find((w) => w.id === workerId)) {
      shelter.workers.push({ id: workerId } as UserModel);
    }
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
