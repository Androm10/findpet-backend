import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/common/constants/tokens';
import { UserEntity } from 'src/core/entities/user-entity';
import { IUserRepository } from 'src/core/interfaces/user-repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
  ) {}

  get(id: number) {
    return this.userRepository.get(id);
  }

  getAll(filter: any, limit?: number, page?: number) {
    return this.userRepository.getAll(filter, limit, page);
  }

  create(data: Omit<UserEntity, 'id'>) {
    return this.userRepository.create(data);
  }

  update(id: number, data: Partial<Omit<UserEntity, 'id'>>) {
    return this.userRepository.update(id, data);
  }

  delete(id: number) {
    return this.userRepository.delete(id);
  }

  getByLogin(login: string) {
    return this.userRepository.getByLogin(login);
  }

  async registerUser(data: {
    login: string;
    password: string;
    username: string;
  }) {
    const user = await this.userRepository.create(data);
    if (!user) {
      throw new BadRequestException('Cannot create user');
    }
    console.log('created', user);
    return await this.userRepository.assignRole(user.id, 'USER');
  }
}
