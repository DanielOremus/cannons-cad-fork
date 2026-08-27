import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloads, TokenType } from '../../types/token';
import { AppConfigService } from '../../../core/config/config.service';

type VerifySuccessReturn<T> = {
  success: true;
  data: T;
};
type VerifyFailureReturn = {
  success: false;
  data: null;
};

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name, {
    timestamp: true,
  });
  constructor(
    private readonly config: AppConfigService,
    private readonly jwtService: JwtService,
  ) {}
  tryParseBearer(bearer?: string): TokenPayloads['access'] | null {
    if (!bearer || !bearer.startsWith('Bearer ')) return null;
    const token = bearer.slice(7);
    try {
      return this.jwtService.verify<TokenPayloads['access']>(token, {
        secret: this.config.jwt.access.secret,
      });
    } catch {
      return null;
    }
  }
  generate<T extends TokenType>(type: T, payload: TokenPayloads[T]) {
    const { secret, ttl } = this.config.jwt[type];
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: ttl,
    });
  }
  tryVerify<T extends TokenType>(
    type: T,
    token: string,
  ): VerifySuccessReturn<TokenPayloads[T]> | VerifyFailureReturn {
    try {
      const payload = this.jwtService.verify<TokenPayloads[T]>(token, {
        secret: this.config.jwt[type].secret,
      });
      return { success: true, data: payload };
    } catch (error) {
      this.logger.debug(error);
      return { success: false, data: null };
    }
  }
}
