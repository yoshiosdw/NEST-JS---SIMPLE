import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../user/user.entity';
import { Profile } from '../profile/profile.entity';

export const AppDataSource = new DataSource({
  type: 'postgres', // ganti sesuai database yang dipakai
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'mydb',
  entities: [User, Profile],
  synchronize: true, // HATI-HATI di production
  logging: false,
});
