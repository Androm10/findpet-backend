const e = process.env;
console.log(e);

export default () => ({
  database: {
    dialect: e.DB_DIAL || 'mysql',
    host: e.DB_HOST || 'mysql',
    port: +e.DB_PORT || 3306,
    username: e.DB_USER || 'root',
    password: e.DB_PASS || '1111',
    database: e.DB_NAME || 'diplome',
    uri: `${e.DB_DIAL}://${e.DB_USER}:${e.DB_PASS}@${e.DB_HOST}:${e.DB_PORT}/${e.DB_NAME}`,
  },
});
