import { registerAs } from '@nestjs/config';

export interface KeycloakConfig {
  authServerUrl: string;
  realm: string;
  clientId: string;
  clientSecret: string;
  publicKey?: string;
  useNested: boolean;
  cookieKey: string;
}

export default registerAs(
  'keycloak',
  (): KeycloakConfig => ({
    authServerUrl:
      process.env.KEYCLOAK_AUTH_SERVER_URL || 'http://localhost:8080',
    realm: process.env.KEYCLOAK_REALM || 'smart-queue',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'smart-queue-api',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
    publicKey: process.env.KEYCLOAK_PUBLIC_KEY,
    useNested: process.env.KEYCLOAK_USE_NESTED === 'true',
    cookieKey: process.env.KEYCLOAK_COOKIE_KEY || 'KEYCLOAK_JWT',
  }),
);
