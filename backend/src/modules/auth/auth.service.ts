import { Injectable } from '@nestjs/common';
import { TokenService } from '../../shared/modules/token/token.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { UserService } from '../user/user.service';
import { randomUUID } from 'crypto';
import { RedisService } from '../../core/redis/redis.service';
import bcrypt from 'bcrypt';
import { UserMapper } from '../user/user.mapper';
import { UnauthorizedError } from '../../shared/errors/app.error';
import { getPermissionsFromRoles } from '@project/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly userMapper: UserMapper,
  ) {}
  async register(dto: RegisterUserDto) {
    const user = await this.userService.create(dto);

    const familyId = randomUUID();
    const refreshJti = randomUUID();

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

    return { refresh, access, user: this.userMapper.toPrivateProfileDto(user) };
  }
  async login(dto: LoginUserDto) {
    const user = await this.userService.getByEmail(dto.email);
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

    await this.redisService.storeRToken(refreshPayload);

    const userPerms = [...getPermissionsFromRoles(...user.roles)];

    await this.redisService.cacheUserPermissions(user.id, userPerms);

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
      user: this.userMapper.toPublicProfileDto(user),
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

    const user = await this.userService.getById(tokenExists.userId);
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
}
