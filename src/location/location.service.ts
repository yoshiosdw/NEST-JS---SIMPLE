import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository, IsNull } from 'typeorm';
import { Location } from './location.entity';
import { CreateLocationDto } from './dtos/create-location.dto';
import { LocationType } from './locationType/location-type.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: TreeRepository<Location>,

    @InjectRepository(LocationType)
    private readonly locationTypeRepository: Repository<LocationType>,
  ) {}

  async create(dto: CreateLocationDto): Promise<Location> {
    const locationType = await this.locationTypeRepository.findOne({ where: { id: dto.locationTypeId } });
    if (!locationType) throw new NotFoundException('Location type not found');

    let parent: Location | null = null;
    if (dto.parentId !== undefined && dto.parentId !== null) {
      if (isNaN(dto.parentId)) {
        throw new BadRequestException('parentId must be a valid number');
      }

      parent = await this.locationRepository.findOne({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException('Parent location not found');
    }

    const location = this.locationRepository.create({
      ...dto,
      locationType,
      parent: parent as any,
    });

    try {
      return await this.locationRepository.save(location);
    } catch (err: any) {
      if (err.message.includes('Nested sets do not support multiple root entities')) {
        throw new BadRequestException('Cannot create multiple root locations. Silakan pilih parent.');
      }
      throw err;
    }
  }

  async findAll(): Promise<Location[]> {
    return this.locationRepository.find({ relations: ['locationType', 'parent', 'children'] });
  }

  async findOne(id: number): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: ['locationType', 'parent', 'children'],
    });
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }

  async remove(id: number): Promise<void> {
    const location = await this.findOne(id);
    await this.locationRepository.remove(location);
  }

  // ✅ Rebuild nested set
  // async rebuildNestedSet(): Promise<void> {
  //   let counter = 1;

  //   const buildTree = async (parentId: number | null) => {
  //     const children = await this.locationRepository.find({
  //       where: parentId === null ? { treeParentId: IsNull() } : { treeParentId: parentId },
  //       order: { id: 'ASC' },
  //     });

  //     for (const child of children) {
  //       child.left = counter;
  //       counter++;

  //       await buildTree(child.id);

  //       child.right = counter;
  //       counter++;

  //       await this.locationRepository.save(child);
  //     }
  //   };

  //   await buildTree(null);
  // }

  // ✅ Find tree dengan rebuild otomatis
  async findTree(): Promise<Location[]> {
    return this.locationRepository.findTrees({ relations: ['locationType'] });
  }

  async findOneWithDescendants(id: number): Promise<Location> {
    const node = await this.locationRepository.findOne({
      where: { id },
      relations: ['parent', 'locationType'],
    });

    if (!node) throw new NotFoundException('Location not found');

    // Ini akan ambil seluruh children rekursif (grandchildren, dst.)
    return this.locationRepository.findDescendantsTree(node);
  }

  async findAncestorsTree(id: number): Promise<Location> {
  // Ambil node utama beserta relasi parent dan locationType
  const node = await this.locationRepository.findOne({
    where: { id },
    relations: ['locationType'],
  });

  if (!node) throw new NotFoundException('Location not found');

  // Ambil seluruh ancestor tree sampai root
  return this.locationRepository.findAncestorsTree(node);
}


}
