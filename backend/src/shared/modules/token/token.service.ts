import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { AppConfigService } from '../../../core/config/config.service';
import { TokenPayloads, TokenType } from '../../types/token';

@Injectable()
export class TokenService {
  constructor(
    private readonly config: AppConfigService,
    private readonly jwtService: JwtService,
  ) {}
  tryParseBearer(bearer: string) {}
  generate<T extends TokenType>(type: T, payload: TokenPayloads[T]) {
    const { secret, ttl } = this.config.jwt(type);
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: ttl,
    });
  }
  tryVerify<T extends TokenType>(
    type: T,
    token: string,
  ): { success: boolean; data: TokenPayloads[T] | null } {
    const { secret, ttl } = this.config.jwt(type);
    try {
      const payload = this.jwtService.verify<TokenPayloads[T]>(token, {
        secret,
      });
      return { success: true, data: payload };
    } catch (error) {
      return { success: false, data: null };
    }
  }
}
