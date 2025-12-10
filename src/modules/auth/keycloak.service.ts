import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwksClient } from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import {
  KeycloakTokenPayload,
  AuthenticatedUser,
  Role,
} from './interfaces/keycloak.interface';

interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  session_state: string;
  scope: string;
}

interface KeycloakUserInfo {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

@Injectable()
export class KeycloakService {
  private readonly logger = new Logger(KeycloakService.name);
  private jwksClient: JwksClient;
  private readonly authServerUrl: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.authServerUrl =
      this.configService.get<string>('keycloak.authServerUrl') ||
      'http://localhost:8080';
    this.realm =
      this.configService.get<string>('keycloak.realm') || 'smart-queue';
    this.clientId =
      this.configService.get<string>('keycloak.clientId') || 'smart-queue-api';
    this.clientSecret =
      this.configService.get<string>('keycloak.clientSecret') || '';

    this.jwksClient = new JwksClient({
      jwksUri: `${this.authServerUrl}/realms/${this.realm}/protocol/openid-connect/certs`,
      cache: true,
      cacheMaxAge: 86400000, // 24 hours
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    });
  }

  /**
   * Get the Keycloak token endpoint URL
   */
  getTokenEndpoint(): string {
    return `${this.authServerUrl}/realms/${this.realm}/protocol/openid-connect/token`;
  }

  /**
   * Get the Keycloak userinfo endpoint URL
   */
  getUserInfoEndpoint(): string {
    return `${this.authServerUrl}/realms/${this.realm}/protocol/openid-connect/userinfo`;
  }

  /**
   * Get the Keycloak logout endpoint URL
   */
  getLogoutEndpoint(): string {
    return `${this.authServerUrl}/realms/${this.realm}/protocol/openid-connect/logout`;
  }

  /**
   * Get the Keycloak authorization endpoint URL
   */
  getAuthorizationEndpoint(): string {
    return `${this.authServerUrl}/realms/${this.realm}/protocol/openid-connect/auth`;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(
    code: string,
    redirectUri: string,
  ): Promise<KeycloakTokenResponse> {
    try {
      const response = await fetch(this.getTokenEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        this.logger.error('Token exchange failed', error);
        throw new BadRequestException('Failed to exchange code for tokens');
      }

      return (await response.json()) as KeycloakTokenResponse;
    } catch (error) {
      this.logger.error('Token exchange error', error);
      throw new InternalServerErrorException('Authentication service error');
    }
  }

  /**
   * Login with username and password (Resource Owner Password Grant)
   * Note: This should only be used for trusted applications
   */
  async login(
    username: string,
    password: string,
  ): Promise<KeycloakTokenResponse> {
    try {
      const response = await fetch(this.getTokenEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          username,
          password,
          scope: 'openid profile email',
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        this.logger.error('Login failed', error);
        throw new UnauthorizedException('Invalid credentials');
      }

      return (await response.json()) as KeycloakTokenResponse;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Login error', error);
      throw new InternalServerErrorException('Authentication service error');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<KeycloakTokenResponse> {
    try {
      const response = await fetch(this.getTokenEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        this.logger.error('Token refresh failed', error);
        throw new UnauthorizedException('Invalid refresh token');
      }

      return (await response.json()) as KeycloakTokenResponse;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Token refresh error', error);
      throw new InternalServerErrorException('Authentication service error');
    }
  }

  /**
   * Logout user by invalidating tokens
   */
  async logout(refreshToken: string): Promise<void> {
    try {
      const response = await fetch(this.getLogoutEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        this.logger.error('Logout failed', error);
        throw new BadRequestException('Logout failed');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Logout error', error);
      throw new InternalServerErrorException('Authentication service error');
    }
  }

  /**
   * Get user info from Keycloak
   */
  async getUserInfo(accessToken: string): Promise<KeycloakUserInfo> {
    try {
      const response = await fetch(this.getUserInfoEndpoint(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('Invalid access token');
      }

      return (await response.json()) as KeycloakUserInfo;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Get user info error', error);
      throw new InternalServerErrorException('Authentication service error');
    }
  }

  /**
   * Validate access token and return payload
   */
  async validateToken(token: string): Promise<KeycloakTokenPayload> {
    const publicKey = this.configService.get<string>('keycloak.publicKey');

    try {
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
      if (!kid) {
        throw new UnauthorizedException('Token missing key ID');
      }

      const key = await this.jwksClient.getSigningKey(kid);
      const signingKey = key.getPublicKey();

      return jwt.verify(token, signingKey, {
        algorithms: ['RS256'],
        issuer: `${this.authServerUrl}/realms/${this.realm}`,
      }) as KeycloakTokenPayload;
    } catch (error) {
      this.logger.error('Token validation failed', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Map token payload to AuthenticatedUser
   */
  mapPayloadToUser(
    payload: KeycloakTokenPayload,
    accessToken: string,
  ): AuthenticatedUser {
    const realmRoles = payload.realm_access?.roles || [];
    const clientRoles = payload.resource_access?.[this.clientId]?.roles || [];

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
      accessToken,
    };
  }

  /**
   * Introspect token (check if active)
   */
  async introspectToken(
    token: string,
  ): Promise<{ active: boolean; [key: string]: unknown }> {
    try {
      const response = await fetch(
        `${this.authServerUrl}/realms/${this.realm}/protocol/openid-connect/token/introspect`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            token,
          }),
        },
      );

      if (!response.ok) {
        throw new InternalServerErrorException('Token introspection failed');
      }

      return (await response.json()) as {
        active: boolean;
        [key: string]: unknown;
      };
    } catch (error) {
      this.logger.error('Token introspection error', error);
      throw new InternalServerErrorException('Authentication service error');
    }
  }

  /**
   * Get OpenID Connect configuration
   */
  async getOpenIdConfiguration(): Promise<Record<string, unknown>> {
    try {
      const response = await fetch(
        `${this.authServerUrl}/realms/${this.realm}/.well-known/openid-configuration`,
      );

      if (!response.ok) {
        throw new InternalServerErrorException(
          'Failed to get OpenID configuration',
        );
      }

      return (await response.json()) as Record<string, unknown>;
    } catch (error) {
      this.logger.error('Get OpenID configuration error', error);
      throw new InternalServerErrorException('Authentication service error');
    }
  }

  /**
   * Register a new user in Keycloak
   */
  async registerUser(signUpData: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    roles?: string[];
  }): Promise<void> {
    try {
      // Get admin access token
      const adminToken = await this.getAdminToken();

      this.logger.debug('signUpData', signUpData);

      const response = await fetch(
        `${this.authServerUrl}/admin/realms/${this.realm}/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            username: signUpData.username,
            email: signUpData.email,
            firstName: signUpData.firstName || '',
            lastName: signUpData.lastName || '',
            enabled: true,
            emailVerified: false,
            credentials: [
              {
                type: 'password',
                value: signUpData.password,
                temporary: false,
              },
            ],
          }),
        },
      );

      this.logger.debug('response', response);

      if (!response.ok) {
        const error = await response.text();
        this.logger.error('User registration failed', error);

        if (response.status === 409) {
          throw new BadRequestException('User already exists');
        }

        if (response.status === 403) {
          throw new BadRequestException(
            'Admin account lacks permissions to create users',
          );
        }

        throw new BadRequestException('Failed to register user');
      }

      // If roles are provided, assign them to the user
      if (signUpData.roles && signUpData.roles.length > 0) {
        const locationHeader = response.headers.get('location');
        const userId = locationHeader?.split('/').pop();

        if (userId) {
          await this.assignRolesToUser(userId, signUpData.roles, adminToken);
        }
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('User registration error', error);
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  /**
   * Assign realm roles to a user
   */
  private async assignRolesToUser(
    userId: string,
    roles: string[],
    adminToken: string,
  ): Promise<void> {
    try {
      // Get available realm roles
      const rolesResponse = await fetch(
        `${this.authServerUrl}/admin/realms/${this.realm}/roles`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (!rolesResponse.ok) {
        throw new InternalServerErrorException(
          'Failed to fetch available roles',
        );
      }

      const availableRoles = (await rolesResponse.json()) as Array<{
        id: string;
        name: string;
      }>;

      // Filter roles that exist
      const rolesToAssign = availableRoles.filter((role) =>
        roles.includes(role.name),
      );

      if (rolesToAssign.length === 0) {
        this.logger.warn('No valid roles found to assign');
        return;
      }

      // Assign roles to user
      const assignResponse = await fetch(
        `${this.authServerUrl}/admin/realms/${this.realm}/users/${userId}/role-mappings/realm`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(rolesToAssign),
        },
      );

      if (!assignResponse.ok) {
        const error = await assignResponse.text();
        this.logger.error('Failed to assign roles to user', error);
        throw new InternalServerErrorException('Failed to assign roles');
      }

      this.logger.debug(
        `Assigned ${rolesToAssign.length} role(s) to user ${userId}`,
      );
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      this.logger.error('Assign roles error', error);
      throw new InternalServerErrorException('Failed to assign roles to user');
    }
  }

  /**
   * Get admin access token for Keycloak admin operations
   */
  private async getAdminToken(): Promise<string> {
    try {
      const response = await fetch(this.getTokenEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new InternalServerErrorException('Failed to get admin token');
      }

      const data = (await response.json()) as KeycloakTokenResponse;
      return data.access_token;
    } catch (error) {
      this.logger.error('Get admin token error', error);
      throw new InternalServerErrorException('Failed to get admin token');
    }
  }
}
