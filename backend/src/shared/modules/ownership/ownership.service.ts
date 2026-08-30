import { Injectable } from '@nestjs/common';
import { VehicleEntity } from '../../../modules/vehicle/entities/vehicle.entity';
import { ForbiddenError, NotFoundError } from '../../errors/app.error';
import { CharacterEntity } from '../../../modules/character/entities/character.entity';
import { PermissionScope } from '@project/shared';
import { CitationEntity } from '../../../modules/citation/entities/citation.entity';

@Injectable()
export class OwnershipService {
  private isOwner(
    resourceUserId: string | undefined,
    currentUserId: string,
    scope: PermissionScope,
  ): boolean {
    if (scope === 'any') return true;
    return !!resourceUserId && resourceUserId === currentUserId;
  }
  checkVehicle(vehicle: VehicleEntity, userId: string, scope: PermissionScope) {
    if (!this.isOwner(vehicle.owner.user.id, userId, scope)) throw new NotFoundError('Vehicle');
  }
  checkCharacter(character: CharacterEntity, userId: string, scope: PermissionScope) {
    if (!this.isOwner(character.user.id, userId, scope)) throw new NotFoundError('Character');
  }
  checkCitation(citation: CitationEntity, userId: string, scope: PermissionScope) {
    if (!this.isOwner(citation.issuedBy?.id, userId, scope)) throw new ForbiddenError();
  }
}
