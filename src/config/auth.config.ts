export default () => ({
  auth: {
    secret: process.env.AUTH_SECRET || 'secret',
    expiresIn: process.env.AUTH_EXPIRES || 20000000,
    refreshSecret: process.env.AUTH_REFRESH_SECRET || 'secrett',
    refreshExpiresIn: +process.env.AUTH_REFRESH_EXPIRES || 30000000,
  },
  authGoogle: {
    secret: process.env.GOOGLE_SECRET || 'secret',
    appId: process.env.GOOGLE_APP_ID || 'shmoogle-chat',
    callbackUrl: process.env.GOOGLE_CALLBACK || 'http://localhost:3000/welcome',
  },
});
