import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { UserEntity } from 'src/core/entities/user-entity';
import { UserModel } from 'src/typeorm/models/user.model';
import { IUserRepository } from 'src/core/interfaces/user-repository';
import { RoleModel } from 'src/typeorm/models/role.model';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserModel)
    private userModel: TypeOrmRepository<UserModel>,
    @InjectRepository(RoleModel)
    private roleModel: TypeOrmRepository<RoleModel>,
  ) {}

  async assignRole(userId: number, roleName: string): Promise<UserEntity> {
    const user = await this.userModel.findOne({
      where: {
        id: userId,
      },
    });

    const role = await this.roleModel.findOne({
      where: { name: roleName },
    });

    if (!user || !role) {
      throw new Error('No such user or role');
    }

    user.roles.push(role);

    await this.userModel.save(user);
    return new UserEntity(user);
  }

  async getByLogin(login: string): Promise<UserEntity> {
    const user = await this.userModel.findOne({ where: { login } });
    return new UserEntity(user);
  }

  async get(id: number): Promise<UserEntity> {
    const user = await this.userModel.findOne({ where: { id } });
    return new UserEntity(user);
  }

  async getAll(): Promise<UserEntity[]> {
    const users = await this.userModel.find();
    return users.map((u) => u as UserEntity);
  }

  async create(data: Omit<UserEntity, 'id'>): Promise<UserEntity> {
    const user = await this.userModel.create(data);
    this.userModel.save(user);
    return user as UserEntity;
  }

  async update(
    id: number,
    data: Partial<Omit<UserEntity, 'id'>>,
  ): Promise<UserEntity> {
    await this.userModel.update({ id }, data);

    return new UserEntity({ ...data, id });
  }

  async delete(id: number): Promise<boolean> {
    await this.userModel.delete({ id });
    return true;
  }
}
