import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @SetMetadata('action', 'read')
  @SetMetadata('subject', 'Task')
  findAll() {
    return this.taskService.findAll();
  }

  @Post()
  @SetMetadata('action', 'create')
  @SetMetadata('subject', 'Task')
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }
}