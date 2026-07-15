import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../../shared/modules/token/token.service';
import {
  LoginUserDto,
  RegisterUserDto,
  UserOwnProfileDto,
} from '@project/shared';
import { UserService } from '../../modules/user/user.service';
import { randomUUID } from 'crypto';
import { RedisService } from '../redis/redis.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
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

    const refresh = this.tokenService.generate('refresh', refreshPayload);
    const access = this.tokenService.generate('access', {
      familyId,
      userRole: user.role,
      userId: user.id,
    });

    //send confirmation email

    return { refresh, access, user };
  }
  async login(dto: LoginUserDto) {
    const exists = await this.userService.getByEmail(dto.email);
    if (!exists) throw new UnauthorizedException();
    const passwordCorrect = await bcrypt.compare(
      dto.password,
      exists.passwordHash,
    );
    if (!passwordCorrect) throw new UnauthorizedException();

    const familyId = randomUUID();
    const refreshJti = randomUUID();

    const refreshPayload = {
      jti: refreshJti,
      familyId,
      userId: exists.id,
    };

    await this.redisService.storeRToken(refreshPayload);

    const refresh = this.tokenService.generate('refresh', refreshPayload);
    const access = this.tokenService.generate('access', {
      familyId,
      userRole: exists.role,
      userId: exists.id,
    });

    return { refresh, access, user: exists };
  }
}
