import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  create(name: string) {
    const role = this.roleRepository.create({ name });
    return this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: string) {
    return this.roleRepository.findOne({ where: { id } });
  }

  async update(id: string, name: string) {
    await this.roleRepository.update(id, { name });
    return this.findOne(id);
  }

  // async remove(id: string) {
  //   const role = await this.findOne(id);
  //   return this.roleRepository.remove(role);
  // }
}
