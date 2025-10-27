import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    const role = this.roleService.create(createRoleDto.name);
    return { status: true, message: 'Role created', data: role };
  }

  @Get()
  findAll() {
    const roles = this.roleService.findAll();
    return { status: true, data: roles };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const role = this.roleService.findOne(id);
    return { status: true, data: role };
  }
}
