import { Injectable } from '@nestjs/common';
import { CharacterEntity } from './entities/character.entity.js';
import { SearchCharacterResponseDto } from './dto/search-character.dto.js';
import { CreateCharacterResponseDto } from './dto/create-character.dto.js';
import { CharacterDto, CharacterListItemDto } from './dto/get-character.dto.js';
import { DriverLicenseMapper } from '../driver-license/driver-license.mapper.js';

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
  toListItemDto(character: CharacterEntity): CharacterListItemDto {
    const { id, firstName, lastName, dob, age, flags } = character;
    return {
      id,
      firstName,
      lastName,
      dob,
      age,
      flags,
    };
  }
  toListDto(characters: CharacterEntity[]): CharacterListItemDto[] {
    return characters.map((c) => this.toListItemDto(c));
  }
}
