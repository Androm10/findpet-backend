import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { UserEntity } from 'src/core/entities/user-entity';
import { UserModel } from 'src/typeorm/models/user.model';
import { IUserRepository } from 'src/core/interfaces/user-repository';
import { RoleModel } from 'src/typeorm/models/role.model';
import { calculatePagination } from 'src/common/utils/calculatePagination';
import { RepositoryError } from 'src/common/types/repository-error';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserModel)
    private userModel: TypeOrmRepository<UserModel>,
    @InjectRepository(RoleModel)
    private roleModel: TypeOrmRepository<RoleModel>,
  ) {}

  async assignRole(userId: number, roleName: string) {
    const user = await this.userModel.findOne({
      where: {
        id: userId,
      },
      relations: {
        roles: true,
      },
    });

    if (!user) {
      throw new RepositoryError('No such user');
    }

    const role = await this.roleModel.findOne({
      where: { name: roleName },
    });

    if (!role) {
      throw new RepositoryError('No such role');
    }
    user.roles.push(role);

    await this.userModel.save(user);
    return new UserEntity(user);
  }

  async getByLogin(login: string) {
    const user = await this.userModel.findOne({ where: { login: login } });
    if (!user) {
      return null;
    }
    return new UserEntity(user);
  }

  async get(id: number) {
    const user = await this.userModel.findOne({
      where: { id },
      relations: { avatar: true },
    });
    return new UserEntity(user);
  }

  async getAll(filter: any, limit?: number, page?: number) {
    const { take, skip } = calculatePagination(limit, page);

    const [users, count] = await this.userModel.findAndCount({
      take,
      skip,
    });
    const result = {
      result: users.map((u) => u as UserEntity),
      limit: take,
      page: page,
      pages: Math.ceil(count / take),
      count,
    };
    return result;
  }

  async create(data: Omit<UserEntity, 'id'>) {
    const user = this.userModel.create(data);
    const created = await this.userModel.save(user);

    const existing = await this.roleModel.findOne({ where: { name: 'USER' } });

    if (!existing) {
      const role = this.roleModel.create({ name: 'USER' });
      await this.roleModel.save(role);
    }
    return new UserEntity(created);
  }

  async update(id: number, data: Partial<Omit<UserEntity, 'id'>>) {
    await this.userModel.update({ id }, data);

    return new UserEntity({ ...data, id });
  }

  async delete(id: number) {
    await this.userModel.delete({ id });
    return true;
  }
}
