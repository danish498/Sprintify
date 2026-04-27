import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { KeycloakService } from './keycloak.service';
import {
  LoginDto,
  RefreshTokenDto,
  LogoutDto,
  ExchangeCodeDto,
  TokenResponseDto,
  UserProfileDto,
  SignUpDto,
} from './dto';
import {
  AuthenticatedUser,
  Role,
  Permission,
  RolePermissions,
} from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Login with username and password
   */
  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    this.logger.log(`Login attempt for user: ${loginDto.username}`);

    const tokens = await this.keycloakService.login(
      loginDto.username,
      loginDto.password,
    );

    this.logger.log(`Tokens: ${JSON.stringify(tokens)}`);

    return this.mapTokenResponse(tokens);
  }

  /**
   * Sign up a new user
   */
  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ message: string; user: { email: string; username: string } }> {
    this.logger.log(`Sign up attempt for user: ${signUpDto.username}`);

    const userId = await this.keycloakService.registerUser({
      email: signUpDto.email,
      username: signUpDto.username,
      password: signUpDto.password,
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
    });

    await this.keycloakService.sendVerificationEmail(userId);

    // Create user in local database
    try {
      const response = await this.prisma.user.create({
        data: {
          id: userId, // Use Keycloak ID as local ID
          email: signUpDto.email,
          username: signUpDto.username,
          firstName: signUpDto.firstName,
          lastName: signUpDto.lastName,
          keycloakId: userId,
          role: 'VIEWER', // Default role
        },
      });

      this.logger.log(`User created in database: ${JSON.stringify(response)}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to create user in database: ${errorMessage}`);

      // Throw error so the user knows registration failed in the local DB
      // Note: In production, you might want to rollback the Keycloak user creation here
      throw new InternalServerErrorException(
        `User created in Keycloak but failed to sync with local database: ${errorMessage}`,
      );
    }

    return {
      message:
        'User registered successfully, Please verify your email and then login.',
      user: {
        email: signUpDto.email,
        username: signUpDto.username,
      },
    };
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCode(
    exchangeCodeDto: ExchangeCodeDto,
  ): Promise<TokenResponseDto> {
    this.logger.log('Exchanging authorization code for tokens');

    const tokens = await this.keycloakService.exchangeCodeForTokens(
      exchangeCodeDto.code,
      exchangeCodeDto.redirectUri,
    );

    return this.mapTokenResponse(tokens);
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<TokenResponseDto> {
    this.logger.log('Refreshing access token');

    const tokens = await this.keycloakService.refreshToken(
      refreshTokenDto.refreshToken,
    );

    return this.mapTokenResponse(tokens);
  }

  /**
   * Logout user
   */
  async logout(logoutDto: LogoutDto): Promise<{ message: string }> {
    this.logger.log('Logging out user');

    await this.keycloakService.logout(logoutDto.refreshToken);

    return { message: 'Successfully logged out' };
  }

  /**
   * Get current user profile
   */
  getProfile(user: AuthenticatedUser): UserProfileDto {
    const permissions = this.getUserPermissions(user.roles);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      emailVerified: user.emailVerified,
      roles: user.roles,
      permissions,
    };
  }

  /**
   * Get permissions based on user roles
   */
  private getUserPermissions(userRoles: string[]): string[] {
    const permissions: Set<Permission> = new Set();

    userRoles.forEach((role) => {
      const rolePermissions = RolePermissions[role as Role];
      if (rolePermissions) {
        rolePermissions.forEach((permission) => permissions.add(permission));
      }
    });

    return Array.from(permissions);
  }

  /**
   * Get user info from Keycloak
   */
  async getUserInfo(accessToken: string): Promise<UserProfileDto> {
    const userInfo = await this.keycloakService.getUserInfo(accessToken);

    return {
      id: userInfo.sub,
      email: userInfo.email,
      username: userInfo.preferred_username,
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
      fullName: userInfo.name,
      emailVerified: userInfo.email_verified,
      roles: [],
      permissions: [],
    };
  }

  /**
   * Validate token and get user
   */
  async validateToken(accessToken: string): Promise<AuthenticatedUser> {
    const payload = await this.keycloakService.validateToken(accessToken);
    return this.keycloakService.mapPayloadToUser(payload, accessToken);
  }

  /**
   * Check if token is active
   */
  async introspectToken(token: string): Promise<{ active: boolean }> {
    const result = await this.keycloakService.introspectToken(token);
    return { active: result.active };
  }

  /**
   * Get OpenID Connect configuration
   */
  async getOpenIdConfiguration(): Promise<Record<string, unknown>> {
    return this.keycloakService.getOpenIdConfiguration();
  }

  /**
   * Map Keycloak token response to our DTO
   */
  private mapTokenResponse(tokens: {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    session_state?: string;
    scope: string;
  }): TokenResponseDto {
    return {
      accessToken: tokens.access_token,
      expiresIn: tokens.expires_in,
      refreshExpiresIn: tokens.refresh_expires_in,
      refreshToken: tokens.refresh_token,
      tokenType: tokens.token_type,
      sessionState: tokens.session_state,
      scope: tokens.scope,
    };
  }
}
