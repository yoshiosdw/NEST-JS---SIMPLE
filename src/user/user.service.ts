import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Profile } from '../profile/profile.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { RegisterDto } from '../auth/dtos/register.dto';
import { Role } from 'src/role/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>, 

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
  ) {}

  // Admin / create user dengan profileId
 async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) throw new ConflictException('Email already registered');

    const profile = await this.profilesRepository.findOne({
      where: { id: createUserDto.profileId },
    });
    if (!profile) throw new NotFoundException('Profile not found');

    const role = await this.rolesRepository.findOne({
      where: { id: createUserDto.roleId },
    });
    if (!role) throw new NotFoundException('Role not found');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      profile,
      role,
    });

    return this.usersRepository.save(user);
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.findByEmail(registerDto.email);
    if (existingUser) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const roleEntity = await this.rolesRepository.findOne({ where: { name: 'user' } });

    if (!roleEntity) throw new NotFoundException('Default role not found');

    const user = this.usersRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      role: roleEntity,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['profile'],
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['profile'] });
  }

  sanitizeUser(user: User) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
