import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { USER_REPOSITORY } from 'src/common/constants/tokens';
import { UserModel } from 'src/sequelize/models/user.model';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
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
