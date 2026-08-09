import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { PrivateUserResponseDto, PublicUserResponseDto } from '@project/shared';

@Injectable()
export class UserMapper {
  private maskEmail(email: string, starsNumber: number = 5) {
    const [address, domain] = email.split('@');
    if (address.length <= 2) return `${address[0]}*@${domain}`;

    const firstChar = address[0];
    const lastChar = address[address.length - 1];
    const stars = '*'.repeat(starsNumber);

    return `${firstChar}${stars}${lastChar}@${domain}`;
  }
  toPrivateProfileDto(user: UserEntity): PrivateUserResponseDto {
    const { name, roles, email, status, emailConfirmed, createdAt } = user;

    return {
      name,
      email: this.maskEmail(email),
      emailConfirmed,
      roles,
      status,
      createdAt: createdAt.toISOString(),
    };
  }
  toPublicProfileDto(user: UserEntity): PublicUserResponseDto {
    const { name, roles, status, createdAt } = user;

    return { name, roles, status, createdAt: createdAt.toISOString() };
  }
}
