import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Location } from './location.entity';
import { LocationType } from './locationType/location-type.entity';
import { JwtModule } from '@nestjs/jwt';
import { AbilityModule } from '../common/abilities/ability.module';
import { AuthModule } from '../auth/auth.module'; // kalau kamu punya module auth

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, LocationType]),
    // JwtModule.register({}), 
    AbilityModule,
    forwardRef(() => AuthModule), 
  ],
  providers: [LocationService],
  controllers: [LocationController],
})
export class LocationModule {}
