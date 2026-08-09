import { Injectable } from '@nestjs/common';
import { TokenService } from '../../shared/modules/token/token.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { randomUUID } from 'crypto';
import { RedisService } from '../../core/redis/redis.service';
import bcrypt from 'bcrypt';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../shared/errors/app.error';
import { ErrorCode, getPermissionsFromRoles, nameof, ValidationIssue } from '@project/shared';
import { UserRepository } from '../user/user.repository';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { AuthUser } from '../../shared/types/user';
import { UnitOfWork } from '../../core/database/unit-of-work';
import { EmailConfirmationService } from './email-confirmation.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly redisService: RedisService,
    private readonly userRepository: UserRepository,
    private readonly uow: UnitOfWork,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}
  async register(dto: RegisterUserDto) {
    const familyId = randomUUID();
    const refreshJti = randomUUID();

    const exists = await this.userRepository.findByEmail(dto.email);
    if (exists) {
      const issue: ValidationIssue<'not_unique'> = {
        code: 'not_unique',
        field: nameof<typeof dto>('email'),
        params: undefined,
      };
      throw new ValidationError([issue]);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const { user } = await this.uow.withTransaction(async () => {
      const user = await this.userRepository.create({
        email: dto.email,
        name: dto.name,
        passwordHash,
      });
      await this.emailConfirmationService.create(user);

      return { user };
    });

    const refreshPayload = {
      jti: refreshJti,
      familyId,
      userId: user.id,
    };

    await this.redisService.storeRToken(refreshPayload);

    const userPerms = [...getPermissionsFromRoles(...user.roles)];

    await this.redisService.cacheUserPermissions(user.id, userPerms);

    const refresh = this.tokenService.generate('refresh', refreshPayload);
    const access = this.tokenService.generate('access', {
      userStatus: user.status,
      emailConfirmed: false,
      familyId,
      userRoles: user.roles,
      userId: user.id,
    });

    return { refresh, access, user };
  }
  async login(dto: LoginUserDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedError();
    const passwordCorrect = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordCorrect) throw new UnauthorizedError();

    const familyId = randomUUID();
    const refreshJti = randomUUID();

    const refreshPayload = {
      jti: refreshJti,
      familyId,
      userId: user.id,
    };

    const userPerms = [...getPermissionsFromRoles(...user.roles)];
    await this.redisService.cacheUserPermissions(user.id, userPerms);

    await this.redisService.storeRToken(refreshPayload);

    const refresh = this.tokenService.generate('refresh', refreshPayload);
    const access = this.tokenService.generate('access', {
      userStatus: user.status,
      emailConfirmed: user.emailConfirmed,
      familyId,
      userRoles: user.roles,
      userId: user.id,
    });

    return { refresh, access, user };
  }
  async logout(userId: string, tokenFamilyId: string) {
    await this.redisService.revokeFamily(userId, tokenFamilyId);
  }
  async refresh(token: string) {
    const { success, data } = this.tokenService.tryVerify('refresh', token);
    if (!success) throw new UnauthorizedError();
    const tokenExists = await this.redisService.getRToken(data.jti);
    if (!tokenExists) throw new UnauthorizedError();

    const familyExists = await this.redisService.familyExists(tokenExists.familyId);
    if (!familyExists) throw new UnauthorizedError();

    if (tokenExists.used) {
      await this.redisService.revokeUserFamilies(tokenExists.userId);
      throw new UnauthorizedError();
    }

    const user = await this.userRepository.findById(tokenExists.userId);
    if (!user) throw new UnauthorizedError();

    await this.redisService.revokeRToken(tokenExists.jti);

    const refreshPayload = {
      familyId: tokenExists.familyId,
      jti: randomUUID(),
      userId: tokenExists.userId,
    };

    await this.redisService.storeRToken(refreshPayload);

    const userPerms = [...getPermissionsFromRoles(...user.roles)];

    await this.redisService.cacheUserPermissions(user.id, userPerms);

    const refresh = this.tokenService.generate('refresh', refreshPayload);
    const access = this.tokenService.generate('access', {
      userStatus: user.status,
      emailConfirmed: user.emailConfirmed,
      familyId: tokenExists.familyId,
      userId: tokenExists.userId,
      userRoles: user.roles,
    });

    return { refresh, access };
  }
  async confirmEmail(authUser: AuthUser, dto: ConfirmEmailDto) {
    const user = await this.userRepository.findById(authUser.id);
    if (!user) throw new UnauthorizedError();
    if (user.emailConfirmed)
      throw new ConflictError('Email is already confirmed', ErrorCode.ALREADY_CONFIRMED);
    await this.emailConfirmationService.confirm(user, dto.code);
  }
  async resendCode(authUser: AuthUser) {
    const user = await this.userRepository.findById(authUser.id);
    if (!user) throw new UnauthorizedError();
    if (user.emailConfirmed)
      throw new ConflictError('Email is already confirmed', ErrorCode.ALREADY_CONFIRMED);
    await this.emailConfirmationService.resend(user);
  }
}
