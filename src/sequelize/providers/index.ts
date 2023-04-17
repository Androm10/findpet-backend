import { Provider } from '@nestjs/common';
import { sequelizeProvider } from './sequelize-provider';

export const sequelizeProviders: Provider[] = [sequelizeProvider];
