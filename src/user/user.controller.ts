import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { errorResponse, crudSuccessResponse, successResponse } from '../common/utils/response.util';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Hanya admin yang bisa create user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrator')
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    try {
      const user = await this.userService.create(dto);
      return crudSuccessResponse(user, 'created');
    } catch (err: any) {
      if (err.status && err.response) {
        return errorResponse(err.response, err.status);
      }
      return errorResponse(err.message || 'Internal server error', 500);
    }
  }

  // GET /users/:id - Ambil detail user berdasarkan ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrator')
  @Get(':id')
  async getUser(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(id);
      return successResponse(this.userService.sanitizeUser(user), 'User retrieved successfully');
    } catch (err: any) {
      if (err.status && err.response) {
        return errorResponse(err.response, err.status);
      }
      return errorResponse(err.message || 'Internal server error', 500);
    }
  }

  // GET /users - Ambil semua user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrator')
  @Get()
  async getAllUsers() {
    try {
      const users = await this.userService.findAll();
      const sanitized = users.map(user => this.userService.sanitizeUser(user));
      return successResponse(sanitized, 'Users retrieved successfully');
    } catch (err: any) {
      return errorResponse(err.message || 'Internal server error', 500);
    }
  }
}
