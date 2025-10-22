// src/profile/profile.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // Semua user login bisa membuat profile
  @UseGuards(JwtAuthGuard)
  @Post()
  async createProfile(@Body() dto: CreateProfileDto, @Request() req) {
    // Bisa menambahkan userId dari token jika ingin mengikat profile ke user
    const profile = await this.profileService.createProfile(dto);
    return {
      status: true,
      message: 'Profile created successfully',
      data: profile,
    };
  }
}
