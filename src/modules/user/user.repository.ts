import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from 'src/core/entities/user-entity';
import { Repository } from 'src/core/interfaces/repository';
import { UserModel } from 'src/sequelize/models/user.model';

@Injectable()
export class UserRepository implements Repository<UserEntity> {
  constructor(@InjectModel(UserModel) private userModel: typeof UserModel) {}

  get(id: number): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
  async getAll(): Promise<UserEntity[]> {
    const users = await this.userModel.findAll();

    return users.map((u) => u as UserEntity);
  }
  async create(data: Omit<UserEntity, 'id'>): Promise<UserEntity> {
    const user = await this.userModel.create(data);
    return user as UserEntity;
  }
  update(
    id: number,
    data: Partial<Omit<UserEntity, 'id'>>,
  ): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
