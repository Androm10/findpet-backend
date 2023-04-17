import { Provider } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from 'src/common/constants/tokens';

export const sequelizeProvider: Provider<any> = {
  provide: SEQUELIZE,
  useFactory: async (sequelize: Sequelize) => {
    await sequelize.sync({ alter: true });
    //TODO: Make it declarative
    // if (!(await sequelize.models.Role.findOne({ where: { name: 'User' } }))) {
    //   await sequelize.models.Role.create({ name: 'User' });
    // }
    // if (!(await sequelize.models.Role.findOne({ where: { name: 'Admin' } }))) {
    //   await sequelize.models.Role.create({ name: 'Admin' });
    // }

    return sequelize;
  },
  inject: [Sequelize],
};
