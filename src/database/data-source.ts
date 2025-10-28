import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../user/user.entity';
import { Profile } from '../profile/profile.entity';
import { Location } from '../location/location.entity';
import { LocationType } from '../location/locationType/location-type.entity';
import { Role } from '../role/role.entity';
import * as dotenv from 'dotenv';

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'user',
//   password: 'password',
//   database: 'mydb',
//   entities: [User, Profile, Location, LocationType, Role],
//   migrations: [__dirname + '/migrations/*{.ts,.js}'],
//   synchronize: false,
//   logging: true,
// });

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // gunakan connection string langsung dari Neon
  host: process.env.DB_HOST, // fallback kalau DATABASE_URL tidak ada
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Profile, Location, LocationType, Role],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
  ssl: {
    rejectUnauthorized: false, // penting untuk koneksi Neon
  },
});
