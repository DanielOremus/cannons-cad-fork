import { Injectable } from '@nestjs/common';
import { TokenService } from '../../shared/modules/token/token.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { randomInt, randomUUID } from 'crypto';
import { RedisService } from '../../core/redis/redis.service';
import bcrypt from 'bcrypt';
import {
  AlreadyExistsError,
  AppError,
  NotFoundError,
  UnauthorizedError,
} from '../../shared/errors/app.error';
import { ErrorCode, getPermissionsFromRoles } from '@project/shared';
import { EmailProducer } from '../email/queue/email.producer';
import { UserRepository } from '../user/user.repository';
import { EmailRepository } from '../email/email.repository';
import { AppConfigService } from '../../core/config/config.service';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { AuthUser } from '../../shared/types/user';
import { UnitOfWork } from '../../core/database/unit-of-work';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly redisService: RedisService,
    private readonly userRepository: UserRepository,
    private readonly emailProducer: EmailProducer,
    private readonly emailRepository: EmailRepository,
    private readonly uow: UnitOfWork,
    private readonly config: AppConfigService,
  ) {}
  async register(dto: RegisterUserDto) {
    const familyId = randomUUID();
    const refreshJti = randomUUID();

    const exists = await this.userRepository.findByEmail(dto.email);
    if (exists)
      throw new AlreadyExistsError('User with this email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const { user, emailConfirmation } = await this.uow.withTransaction(
      async () => {
        const confirmationCode = randomInt(100000, 999999).toString();
        const user = await this.userRepository.create({
          email: dto.email,
          name: dto.name,
          passwordHash,
        });
        // const emailConfirmation = await this.emailRepository.createConfirmation(
        //   {
        //     code: confirmationCode,
        //     email: user.email,
        //     expiresAt: new Date(
        //       Date.now() + this.config.email.confirmationTtl * 1000,
        //     ),
        //   },
        // );
        return { user, emailConfirmation };
      },
    );

    // await this.emailProducer.add('confirmEmail', {
    //   code: emailConfirmation.code,
    //   target: user.email,
    //   userName: user.name,
    //   ttl: this.config.email.confirmationTtl,
    // });

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

    //send confirmation email

    return { refresh, access, user };
  }
  async login(dto: LoginUserDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedError();
    const passwordCorrect = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
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

    return {
      refresh,
      access,
      user,
    };
  }
  async logout(userId: string, tokenFamilyId: string) {
    await this.redisService.revokeFamily(userId, tokenFamilyId);
  }
  async refresh(token: string) {
    const { success, data } = this.tokenService.tryVerify('refresh', token);
    if (!success) throw new UnauthorizedError();
    const tokenExists = await this.redisService.getRToken(data.jti);
    if (!tokenExists) throw new UnauthorizedError();

    const familyExists = await this.redisService.familyExists(
      tokenExists.familyId,
    );
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
    if (!user) throw new NotFoundError('User');

    const confirmation = await this.emailRepository.findByEmail(user.email);
    if (!confirmation) throw new NotFoundError('Confirmation');

    if (confirmation.expiresAt.getTime() <= new Date().getTime()) {
      await this.emailRepository.deleteByEmail(confirmation.email);
      throw new AppError('Code expired', ErrorCode.CODE_EXPIRED);
    }
    if (confirmation.code !== dto.code) {
      if (confirmation.attempts >= 2) {
        await this.emailRepository.deleteByEmail(confirmation.email);
        throw new AppError('Out of attempts', ErrorCode.TOO_MANY_ATTEMPTS);
      }
      await this.emailRepository.incrementAttempt(confirmation.email);
      // throw new ValidationError([], "Code does not match")
      throw new AppError('Code does not match', ErrorCode.VALIDATION_FAILED);
    }
    await this.uow.withTransaction(async () => {
      await this.emailRepository.deleteByEmail(confirmation.email);
      await this.userRepository.update(user.id, { emailConfirmed: true });
    });
  }
}
