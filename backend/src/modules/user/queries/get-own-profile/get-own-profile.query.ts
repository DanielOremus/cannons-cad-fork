import { Query } from '@nestjs/cqrs';
import { ProfileDto } from '../../dto/get-user.dto.js';

export class GetOwnProfileQuery extends Query<ProfileDto> {
  constructor(readonly userId: string) {
    super();
  }
}
