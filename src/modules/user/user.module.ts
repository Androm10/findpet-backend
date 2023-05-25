import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_REPOSITORY } from 'src/common/constants/tokens';
import { RoleModel } from 'src/typeorm/models/role.model';
import { UserModel } from 'src/typeorm/models/user.model';
import { PhotoModule } from '../photo/photo.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([UserModel, RoleModel]), PhotoModule],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
