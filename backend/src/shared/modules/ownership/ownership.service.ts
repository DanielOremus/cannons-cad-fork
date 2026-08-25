import { Injectable } from '@nestjs/common';
import { VehicleEntity } from '../../../modules/vehicle/entities/vehicle.entity';
import { NotFoundError } from '../../errors/app.error';
import { CharacterEntity } from '../../../modules/character/entities/character.entity';
import { PermissionScope } from '@project/shared';

@Injectable()
export class OwnershipService {
  checkVehicle(vehicle: VehicleEntity, userId: string, scope: PermissionScope) {
    if (scope === 'own' && vehicle.owner.user.id !== userId) throw new NotFoundError('Vehicle');
  }
  checkCharacter(character: CharacterEntity, userId: string, scope: PermissionScope) {
    if (scope === 'own' && character.user.id !== userId) throw new NotFoundError('Character');
  }
}
