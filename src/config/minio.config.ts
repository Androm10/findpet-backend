export default () => ({
  minio: {
    port: process.env.MINIO_API_PORT || 'redis',
  },
});
