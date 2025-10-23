// src/location/location-type.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationType } from './location-type.entity';
import { CreateLocationTypeDto } from '../dtos/create-location-type.dto';

@Injectable()
export class LocationTypeService {
  constructor(
    @InjectRepository(LocationType)
    private readonly locationTypeRepo: Repository<LocationType>,
  ) {}

  async create(dto: CreateLocationTypeDto): Promise<LocationType> {
    const exists = await this.locationTypeRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Location type already exists');

    const locationType = this.locationTypeRepo.create(dto);
    return this.locationTypeRepo.save(locationType);
  }

  async findAll(): Promise<LocationType[]> {
    return this.locationTypeRepo.find();
  }

  async findById(id: string): Promise<LocationType> {
    const locationType = await this.locationTypeRepo.findOne({ where: { id } });
    if (!locationType) throw new NotFoundException('Location type not found');
    return locationType;
  }
}
