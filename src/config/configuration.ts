export default () => ({
  port: parseInt(process.env.PORT, 10),
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  admin: {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    email: process.env.ADMIN_EMAIL,
  },
  iot: {
    api: process.env.IOT_API,
    apiKey: process.env.IOT_API_KEY,
    apiSecret: process.env.IOT_API_SECRET,
  },
  job: {
    syncDevicePageSize: parseInt(process.env.JOB_SYNC_DEVICE_PAGE_SIZE, 10),
  },
  weixin: {
    appid: process.env.WEIXIN_APPID,
    secret: process.env.WEIXIN_SECRET,
  },
});
