// src/profile/profile.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { CreateProfileDto } from './dtos/create-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createProfile(dto: CreateProfileDto): Promise<Profile> {
    const profile = this.profileRepository.create(dto);
    return this.profileRepository.save(profile);
  }

  async findById(id: string): Promise<Profile | null> {
    return this.profileRepository.findOne({ where: { id } });
  }
}
