import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dtos/create-location.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { errorResponse, crudSuccessResponse, successResponse } from '../common/utils/response.util';

@Controller('locations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Roles('administrator')
  @Post()
  async create(@Body() dto: CreateLocationDto) {
    try {
      const location = await this.locationService.create(dto);
      return crudSuccessResponse(location, 'Location created');
    } catch (err: any) {
      if (err.status && err.response) return errorResponse(err.response, err.status);
      return errorResponse(err.message || 'Internal server error', 500);
    }
  }

  @Get()
  async findAll() {
    try {
      const locations = await this.locationService.findAll();
      return successResponse(locations);
    } catch (err: any) {
      if (err.status && err.response) return errorResponse(err.response, err.status);
      return errorResponse(err.message || 'Internal server error', 500);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const location = await this.locationService.findOne(id);
      return successResponse(location);
    } catch (err: any) {
      if (err.status && err.response) return errorResponse(err.response, err.status);
      return errorResponse(err.message || 'Internal server error', 500);
    }
  }

  @Roles('administrator')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.locationService.remove(id);
      return crudSuccessResponse(null, 'Location deleted');
    } catch (err: any) {
      if (err.status && err.response) return errorResponse(err.response, err.status);
      return errorResponse(err.message || 'Internal server error', 500);
    }
  }

  @Get(':id/descendants')
  async findOneWithDescendants(@Param('id') id: number) {
    try {
      const location = await this.locationService.findOneWithDescendants(Number(id));
      return successResponse(location);
    } catch (err: any) {
      if (err.status && err.response) return errorResponse(err.response, err.status);
      return errorResponse(err.message || 'Internal server error', 500);
    }
  }

 @Get(':id/ancestors')
  async findAncestors(@Param('id') id: number) {
    try {
      const tree = await this.locationService.findAncestorsTree(Number(id));
      return successResponse(tree);
    } catch (err: any) {
      if (err.status && err.response) return errorResponse(err.response, err.status);
      return errorResponse(err.message || 'Internal server error', 500);
    }
  }



  // ✅ Endpoint tree
  @Get('tree')
  async findTree() {
    try {
      const tree = await this.locationService.findTree();
      return successResponse(tree);
    } catch (err: any) {
      if (err.status && err.response) return errorResponse(err.response, err.status);
      return errorResponse(err.message || 'Internal server error', 500);
    }
  }

  // ✅ Manual rebuild nested set
  // @Post('rebuild-tree')
  // async rebuildTree() {
  //   try {
  //     await this.locationService.rebuildNestedSet();
  //     return { status: true, message: 'Nested set rebuilt successfully' };
  //   } catch (err: any) {
  //     return errorResponse(err.message || 'Failed to rebuild tree', 500);
  //   }
  // }
}
