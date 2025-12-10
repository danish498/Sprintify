import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import {
  KeycloakTokenPayload,
  AuthenticatedUser,
  Role,
} from '../interfaces/keycloak.interface';

@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  private readonly logger = new Logger(KeycloakAuthGuard.name);
  private jwksClient: JwksClient;

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    const authServerUrl = this.configService.get<string>(
      'keycloak.authServerUrl',
    );
    const realm = this.configService.get<string>('keycloak.realm');

    this.jwksClient = new JwksClient({
      jwksUri: `${authServerUrl}/realms/${realm}/protocol/openid-connect/certs`,
      cache: true,
      cacheMaxAge: 86400000, // 24 hours
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      const payload = await this.validateToken(token);
      const user = this.mapPayloadToUser(payload, token);
      request.user = user;
      return true;
    } catch (error) {
      this.logger.error('Token validation failed', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }

  private async validateToken(token: string): Promise<KeycloakTokenPayload> {
    const publicKey = this.configService.get<string>('keycloak.publicKey');

    if (publicKey) {
      // Use static public key if provided
      return jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      }) as KeycloakTokenPayload;
    }

    // Use JWKS for dynamic key resolution
    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken || typeof decodedToken === 'string') {
      throw new UnauthorizedException('Invalid token format');
    }

    const kid = decodedToken.header.kid;
    const key = await this.jwksClient.getSigningKey(kid);
    const signingKey = key.getPublicKey();

    return jwt.verify(token, signingKey, {
      algorithms: ['RS256'],
      issuer: `${this.configService.get<string>('keycloak.authServerUrl')}/realms/${this.configService.get<string>('keycloak.realm')}`,
    }) as KeycloakTokenPayload;
  }

  private mapPayloadToUser(
    payload: KeycloakTokenPayload,
    token: string,
  ): AuthenticatedUser {
    const clientId = this.configService.get<string>('keycloak.clientId');
    const realmRoles = payload.realm_access?.roles || [];
    const clientRoles = clientId
      ? payload.resource_access?.[clientId]?.roles || []
      : [];

    // Combine realm and client roles
    const allRoles = [...new Set([...realmRoles, ...clientRoles])];

    // Map to our Role enum where possible
    const mappedRoles = allRoles.filter((role) =>
      Object.values(Role).includes(role as Role),
    );

    return {
      id: payload.sub,
      email: payload.email,
      username: payload.preferred_username || payload.sub,
      firstName: payload.given_name,
      lastName: payload.family_name,
      fullName: payload.name,
      emailVerified: payload.email_verified || false,
      roles: mappedRoles.length > 0 ? mappedRoles : [Role.USER],
      realmRoles,
      clientRoles,
      accessToken: token,
    };
  }
}
