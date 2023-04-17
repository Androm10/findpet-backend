export default () => ({
  database: {
    dialect: process.env.DB_DIAL || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '1111',
    database: process.env.DB_NAME || 'gamestore',
  },
});
