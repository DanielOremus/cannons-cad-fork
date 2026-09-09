import { Injectable } from '@nestjs/common';
import { VehicleEntity } from '../../../modules/vehicle/entities/vehicle.entity.js';
import { ForbiddenError, NotFoundError } from '../../errors/app.error.js';
import { CharacterEntity } from '../../../modules/character/entities/character.entity.js';
import { CitationEntity } from '../../../modules/citation/entities/citation.entity.js';
import { UserEntity } from '../../../modules/user/entities/user.entity.js';

@Injectable()
export class OwnershipService {
  private isOwner(currentUserId: string, resourceUserId: string = ''): boolean {
    return !!resourceUserId && resourceUserId === currentUserId;
  }
  checkVehicle(vehicle: VehicleEntity, userId: string) {
    if (!this.isOwner(userId, vehicle.owner.user.id)) throw new NotFoundError('Vehicle');
  }
  checkCharacter(character: CharacterEntity, userId: string) {
    if (!this.isOwner(userId, character.user.id)) throw new NotFoundError('Character');
  }
  checkCitation(citation: CitationEntity, userId: string) {
    if (!this.isOwner(userId, citation.issuedBy?.id)) throw new ForbiddenError();
  }
  checkProfile(targetUserId: string, currentUserId: string) {
    if (!this.isOwner(targetUserId, currentUserId)) throw new ForbiddenError();
  }
}
