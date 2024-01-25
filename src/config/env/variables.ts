import { registerAs } from '@nestjs/config'

export const EnvironmentVariables = registerAs('config', () => {
  return {
    environment: process.env.NODE_ENV,
    app: {
      driver: {
        storageDriver: process.env.STORAGE_DRIVER,
        tokenDriver: process.env.TOKEN_DRIVER,
        cryptographyDriver: process.env.CRYPTOGRAPHY_DRIVER,
      },
      frontWebUrl: process.env.FRONT_WEB_URL,
      serverUrl: process.env.SERVER_URL,
      port: process.env.PORT,
      uploadFileLimitSize: process.env.UPLOAD_FILE_LIMIT_SIZE,
    },
    database: {
      uri: process.env.MONGODB_CONNECTION,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    bunny: {
      apiKey: process.env.BUNNY_API_KEY,
      hostname: process.env.BUNNY_HOSTNAME,
      storageName: process.env.BUNNY_STORAGE_NAME,
    },
  }
})
