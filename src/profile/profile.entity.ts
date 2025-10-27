import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  nik?: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: false })
  address: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
