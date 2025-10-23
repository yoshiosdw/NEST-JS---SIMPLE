// src/location/location-type.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { LocationTypeService } from './location-type.service';
import { CreateLocationTypeDto } from '../dtos/create-location-type.dto';

@Controller('location-types')
export class LocationTypeController {
  constructor(private readonly locationTypeService: LocationTypeService) {}

  @Post()
  async create(@Body() dto: CreateLocationTypeDto) {
    const locationType = await this.locationTypeService.create(dto);
    return { status: true, message: 'Location type created', data: locationType };
  }

  @Get()
  async findAll() {
    const locationTypes = await this.locationTypeService.findAll();
    return { status: true, data: locationTypes };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const locationType = await this.locationTypeService.findById(id);
    return { status: true, data: locationType };
  }
}
