// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { LocationTypeModule } from './location/locationType/location-type.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
  ConfigModule.forRoot({ isGlobal: true }),

  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    synchronize: true, // ⚠️ hanya untuk dev
  }),

  UserModule,
  ProfileModule,
  AuthModule,
  LocationTypeModule,
  LocationModule
],

})
export class AppModule {}
