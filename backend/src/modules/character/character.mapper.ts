import { Injectable } from '@nestjs/common';
import { CharacterEntity } from './entities/character.entity';
import { SearchCharacterResponseDto } from './dto/search-character.dto';
import { CreateCharacterResponseDto } from './dto/create-character.dto';
import { CharacterDto } from './dto/get-character.dto';
import { DriverLicenseMapper } from '../driver-license/driver-license.mapper';

function omitProperties<T extends object, K extends keyof T>(
  value: T,
  keys: readonly K[],
): Omit<T, K> {
  const copy = { ...value };

  for (const key of keys) {
    delete copy[key];
  }

  return copy;
}

@Injectable()
export class CharacterMapper {
  constructor(private readonly driverLicenseMapper: DriverLicenseMapper) {}

  toSearchResponseDto(
    character: CharacterEntity,
    counts: { vehicles: number; citations: number },
  ): SearchCharacterResponseDto {
    const characterFields = omitProperties(character, ['vehicles', 'citations'] as const);

    return {
      ...characterFields,
      age: character.age,
      citationsCount: counts.citations,
      vehiclesCount: counts.vehicles,
      driverLicense: character.driverLicense
        ? this.driverLicenseMapper.toReadDto(character.driverLicense)
        : null,
      user: { name: character.user?.name },
    };
  }
  toReadDto(
    character: CharacterEntity,
    counts: { vehicles: number; citations: number },
  ): CharacterDto {
    const characterFields = omitProperties(character, [
      'user',
      'vehicles',
      'citations',
      'driverLicense',
    ] as const);

    return {
      ...characterFields,
      age: character.age,
      driverLicense: character.driverLicense
        ? this.driverLicenseMapper.toReadDto(character.driverLicense)
        : null,
      vehiclesCount: counts.vehicles,
      citationsCount: counts.citations,
    };
  }
  toCreateResponseDto(character: CharacterEntity): CreateCharacterResponseDto {
    const characterFields = omitProperties(character, ['user'] as const);

    return {
      ...characterFields,
      age: character.age,
    };
  }
}
