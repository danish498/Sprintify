import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KeycloakService } from './keycloak.service';
import { KeycloakAuthGuard, RolesGuard, PermissionsGuard } from './guards';
import keycloakConfig from '../../config/keycloak.config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(keycloakConfig)],
  controllers: [AuthController],
  providers: [
    AuthService,
    KeycloakService,
    // Register guards globally
    {
      provide: APP_GUARD,
      useClass: KeycloakAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [AuthService, KeycloakService],
})
export class AuthModule {}
