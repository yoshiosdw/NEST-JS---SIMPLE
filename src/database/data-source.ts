import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../user/user.entity';
import { Profile } from '../profile/profile.entity';
import { Location } from '../location/location.entity';
import { LocationType } from '../location/locationType/location-type.entity';
import { Role } from '../role/role.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'mydb',
  entities: [User, Profile, Location, LocationType, Role],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
