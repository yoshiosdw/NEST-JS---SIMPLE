// src/location/location-type.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationType } from './location-type.entity';
import { LocationTypeService } from './location-type.service';
import { LocationTypeController } from './location-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LocationType])],
  providers: [LocationTypeService],
  controllers: [LocationTypeController],
  exports: [LocationTypeService],
})
export class LocationTypeModule {}
