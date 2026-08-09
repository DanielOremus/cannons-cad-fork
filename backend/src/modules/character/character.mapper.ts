import { Injectable } from '@nestjs/common';
import { CharacterEntity } from './entities/character.entity';
import { SearchCharacterResponseDto } from './dto/search-character.dto';
import { CreateCharacterResponseDto } from './dto/create-character.dto';
import { CharacterDto } from './dto/get-character.dto';
import { DriverLicenseMapper } from '../driver-license/driver-license.mapper';

@Injectable()
export class CharacterMapper {
  constructor(private readonly driverLicenseMapper: DriverLicenseMapper) {}
  toSearchResponseDto(
    character: CharacterEntity,
    counts: { vehicles: number; citations: number },
  ): SearchCharacterResponseDto {
    const { vehicles, citations, ...rest } = character;
    return {
      ...rest,
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
    const { user, vehicles, citations, driverLicense, ...rest } = character;
    return {
      ...rest,
      age: character.age,
      driverLicense: driverLicense ? this.driverLicenseMapper.toReadDto(driverLicense) : null,
      vehiclesCount: counts.vehicles,
      citationsCount: counts.citations,
    };
  }
  toCreateResponseDto(character: CharacterEntity): CreateCharacterResponseDto {
    const { user, ...rest } = character;
    return {
      ...rest,
      age: character.age,
    };
  }
}
