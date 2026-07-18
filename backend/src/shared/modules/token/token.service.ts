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
  tryParseBearer(bearer: string) {}
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
    const { secret } = this.config.jwt[type];
    try {
      const payload = this.jwtService.verify<TokenPayloads[T]>(token, {
        secret,
      });
      return { success: true, data: payload };
    } catch (error) {
      this.logger.debug(error);
      return { success: false, data: null };
    }
  }
}
