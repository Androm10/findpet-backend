export default () => ({
  minio: {
    port: process.env.MINIO_API_PORT || 'redis',
    useSSL: process.env.MINIO_USE_SSL == 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  },
});
