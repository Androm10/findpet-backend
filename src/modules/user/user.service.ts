import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/common/constants/tokens';
import { UserEntity } from 'src/core/entities/user-entity';
import { IUserRepository } from 'src/core/interfaces/user-repository';
import { PhotoService } from '../photo/photo.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
    private photoService: PhotoService,
  ) {}

  get(id: number) {
    return this.userRepository.get(id);
  }

  getAll(filter: any, limit?: number, page?: number) {
    return this.userRepository.getAll(filter, limit, page);
  }

  create(data: CreateUserDto) {
    const user = {
      ...data,
      isOnline: false,
      lastOnlineDate: new Date(),
    };

    return this.userRepository.create(user);
  }

  update(id: number, data: Partial<Omit<UserEntity, 'id'>>) {
    return this.userRepository.update(id, data);
  }

  async updateAvatar(id: number, file: Express.Multer.File) {
    if (!file.mimetype.includes('image')) {
      throw new BadRequestException('File must be an image');
    }

    const user = await this.userRepository.get(id);
    if (!user) {
      throw new BadRequestException('No such user');
    }

    return this.photoService.updateUserAvatar(id, file);
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
    const userData = {
      ...data,
      isOnline: false,
      lastOnlineDate: new Date(),
    };

    const user = await this.userRepository.create(userData);
    if (!user) {
      throw new BadRequestException('Cannot create user');
    }
    console.log('created', user);
    return await this.userRepository.assignRole(user.id, 'USER');
  }
}
