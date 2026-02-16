import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RefreshTokenDto,
  LogoutDto,
  ExchangeCodeDto,
  TokenResponseDto,
  UserProfileDto,
  SignUpDto,
} from './dto';
import { Public } from './decorators';
import { CurrentUser } from './decorators';
import { KeycloakAuthGuard } from './guards';
import type { AuthenticatedUser } from './interfaces';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<TokenResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User registered successfully' },
        user: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'john.doe@example.com' },
            username: { type: 'string', example: 'john.doe' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data or user already exists',
  })
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ message: string; user: { email: string; username: string } }> {
    return await this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('exchange-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange authorization code for tokens' })
  @ApiBody({ type: ExchangeCodeDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully exchanged code for tokens',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid authorization code' })
  async exchangeCode(
    @Body() exchangeCodeDto: ExchangeCodeDto,
  ): Promise<TokenResponseDto> {
    return this.authService.exchangeCode(exchangeCodeDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully refreshed token',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<TokenResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(KeycloakAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout user' })
  @ApiBody({ type: LogoutDto })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Body() logoutDto: LogoutDto): Promise<{ message: string }> {
    return this.authService.logout(logoutDto);
  }

  @Get('profile')
  @UseGuards(KeycloakAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser() user: AuthenticatedUser): UserProfileDto {
    return this.authService.getProfile(user);
  }

  @Public()
  @Get('openid-configuration')
  @ApiOperation({ summary: 'Get OpenID Connect configuration' })
  @ApiResponse({
    status: 200,
    description: 'OpenID Connect configuration',
  })
  async getOpenIdConfiguration(): Promise<Record<string, unknown>> {
    return this.authService.getOpenIdConfiguration();
  }

  @Post('introspect')
  @UseGuards(KeycloakAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Introspect token' })
  @ApiResponse({
    status: 200,
    description: 'Token introspection result',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async introspectToken(
    @CurrentUser('accessToken') accessToken: string,
  ): Promise<{ active: boolean }> {
    return this.authService.introspectToken(accessToken);
  }
}
