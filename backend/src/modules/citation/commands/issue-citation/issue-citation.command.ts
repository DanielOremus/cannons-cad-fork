import { Query } from '@nestjs/cqrs';
import { CreateCitationDto } from '../../dto/create-citation.dto';

export class IssueCitationCommand extends Query<void> {
  constructor(readonly dto: CreateCitationDto) {
    super();
  }
}
