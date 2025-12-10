export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    name: process.env.DATABASE_NAME || 'smart_queue',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  keycloak: {
    authServerUrl:
      process.env.KEYCLOAK_AUTH_SERVER_URL || 'http://localhost:8080',
    realm: process.env.KEYCLOAK_REALM || 'smart-queue',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'smart-queue-api',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
    publicKey: process.env.KEYCLOAK_PUBLIC_KEY,
  },
});
