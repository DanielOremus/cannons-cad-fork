import { Query } from '@nestjs/cqrs';
import { ProfileDto } from '../../dto/get-user.dto';

export class GetOwnProfileQuery extends Query<ProfileDto> {
  constructor(readonly userId: string) {
    super();
  }
}
