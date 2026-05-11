import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './authService';
import { LoginDto } from './dto/login';
import { RegisterDto } from './dto/register';
import { LoginResponse, RegisterResponse } from './dto/auth-responses';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyTotpDto,
} from './dto/auth-additional';
import { UnauthorizedException } from '@nestjs/common';
import { PasswordResetService } from './resetPassword/reset-password.service';
import { emitClientChanged } from '../socket';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  @Mutation(() => LoginResponse)
  async login(@Args('loginInput') loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Mutation(() => RegisterResponse)
  async register(@Args('registerInput') registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    emitClientChanged('created', result.user);
    return result;
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordDto: ForgotPasswordDto,
  ) {
    await this.passwordResetService.forgotPassword(forgotPasswordDto.email);
    return true;
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordDto: ResetPasswordDto,
  ) {
    await this.passwordResetService.resetPassword(resetPasswordDto);
    return true;
  }

  @Mutation(() => LoginResponse)
  async verifyTotp(@Args('verifyTotpInput') verifyTotpDto: VerifyTotpDto) {
    return this.authService.verifyTotpAndLogin(
      verifyTotpDto.tempToken,
      verifyTotpDto.code,
    );
  }
}
