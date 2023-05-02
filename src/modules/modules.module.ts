import { Module } from '@nestjs/common';
import { AnimalModule } from './animal/animal.module';
import { AuthModule } from './auth/auth.module';
import { ShelterModule } from './shelter/shelter.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, ShelterModule, AnimalModule, AuthModule],
  exports: [UserModule, ShelterModule, AnimalModule, AuthModule],
})
export class ModulesModule {}
