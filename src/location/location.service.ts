import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository, IsNull, DeepPartial } from 'typeorm';
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

  // async create(dto: CreateLocationDto): Promise<Location> {
  //   const locationType = await this.locationTypeRepository.findOne({ where: { id: dto.locationTypeId } });
  //   if (!locationType) throw new NotFoundException('Location type not found');

  //   let parent: Location | null = null;
  //   if (dto.parentId !== undefined && dto.parentId !== null) {
  //     if (isNaN(dto.parentId)) {
  //       throw new BadRequestException('parentId must be a valid number');
  //     }

  //     parent = await this.locationRepository.findOne({ where: { id: dto.parentId } });
  //     if (!parent) throw new NotFoundException('Parent location not found');
  //   }

  //   const location = this.locationRepository.create({
  //     ...dto,
  //     locationType,
  //     parent: parent as any,
  //   });

  //   try {
  //     return await this.locationRepository.save(location);
  //   } catch (err: any) {
  //     if (err.message.includes('Nested sets do not support multiple root entities')) {
  //       throw new BadRequestException('Cannot create multiple root locations. Silakan pilih parent.');
  //     }
  //     throw err;
  //   }
  // }

async create(dto: CreateLocationDto): Promise<Location> {
    // 🔍 Pastikan location type valid
    const locationType = await this.locationTypeRepository.findOne({
      where: { id: dto.locationTypeId },
    });
    if (!locationType) {
      throw new NotFoundException('Location type not found');
    }

    let parent: Location | null = null;

    // 🧱 Jika tidak ada parent → ini root node
    if (dto.parentId === null || dto.parentId === undefined) {
      const existingRoot = await this.locationRepository.findOne({
        where: { parent: IsNull() },
      });
      if (existingRoot) {
        throw new BadRequestException(
          'Root location sudah ada. Semua lokasi baru harus memiliki parent.'
        );
      }
    } else {
      // 🧩 Validasi parent
      if (isNaN(dto.parentId)) {
        throw new BadRequestException('parentId must be a valid number');
      }

      parent = await this.locationRepository.findOne({
        where: { id: dto.parentId },
        relations: ['children'],
      });
      if (!parent) throw new NotFoundException('Parent location not found');
    }

    // 🚫 Jika node ini punya parent, maka parent dianggap kategori (tanpa capacity)
    if (parent) {
      await this.locationRepository.update(parent.id, { capacity: null });
    }

    const newLocation: DeepPartial<Location> = {
      locationType,
      parent: parent ?? undefined, // 🟢 ubah null → undefined
      main_warehouse: dto.main_warehouse ?? '0',
      code: dto.code,
      name: dto.name,
      additional_info: dto.additional_info ?? undefined, // 🟢 ubah null → undefined
      capacity: dto.capacity ?? undefined, // 🟢 ubah null → undefined
    };


    try {
      // 💾 Simpan ke database
      const saved = await this.locationRepository.save(newLocation);
      return saved as Location;
    } catch (err: any) {
      if (err.message?.includes('Nested sets do not support multiple root entities')) {
        throw new BadRequestException(
          'Tidak bisa membuat lebih dari satu root location.'
        );
      }
      throw err;
    }
  }


  async findAll(): Promise<(Location & { total_capacity: number })[]> {
  // 🔹 Ambil seluruh tree (bukan sekadar 1 level relasi)
  const trees = await this.locationRepository.findTrees({
    relations: ['locationType'],
  });

  // 🔹 Fungsi rekursif untuk menjumlah semua capacity hingga ke bawah
  const calcTotal = (loc: Location): number => {
    if (!loc.children || loc.children.length === 0) {
      return loc.capacity ?? 0;
    }
    return (loc.capacity ?? 0) + loc.children.reduce(
      (sum, child) => sum + calcTotal(child),
      0,
    );
  };

  // 🔹 Tambahkan properti baru "total_capacity" untuk setiap node
  const addTotalRecursive = (locs: Location[]): (Location & { total_capacity: number })[] => {
    return locs.map(loc => ({
      ...loc,
      total_capacity: calcTotal(loc),
      children: loc.children ? addTotalRecursive(loc.children) : [],
    }));
  };

  return addTotalRecursive(trees);
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

  async findOneWithDescendants(
    id: number,
  ): Promise<Location & { total_capacity: number }> {
    // Ambil node target
    const node = await this.locationRepository.findOne({
      where: { id },
      relations: ['parent', 'locationType'],
    });

    if (!node) throw new NotFoundException('Location not found');

    // Ambil seluruh children (rekursif)
    const tree = await this.locationRepository.findDescendantsTree(node);

    // 🔹 Fungsi rekursif untuk menghitung total capacity dari seluruh descendants
    const calcTotal = (loc: Location): number => {
      if (!loc.children || loc.children.length === 0) {
        return loc.capacity ?? 0;
      }
      return (loc.capacity ?? 0) + loc.children.reduce(
        (sum, child) => sum + calcTotal(child),
        0,
      );
    };

    // 🔹 Tambahkan total ke setiap node
    const addTotalRecursive = (loc: Location): Location & { total_capacity: number } => ({
      ...loc,
      total_capacity: calcTotal(loc),
      children: loc.children?.map(addTotalRecursive) ?? [],
    });

    return addTotalRecursive(tree);
  }

  async findAncestorsTree(
    id: number,
  ): Promise<Location & { total_capacity: number }> {
    // Ambil node target
    const node = await this.locationRepository.findOne({
      where: { id },
      relations: ['locationType'],
    });

    if (!node) throw new NotFoundException('Location not found');

    // Ambil semua ancestor tree sampai root
    const tree = await this.locationRepository.findAncestorsTree(node);

    // 🔹 Fungsi rekursif total capacity
    const calcTotal = (loc: Location): number => {
      if (!loc.children || loc.children.length === 0) {
        return loc.capacity ?? 0;
      }
      return (loc.capacity ?? 0) + loc.children.reduce(
        (sum, child) => sum + calcTotal(child),
        0,
      );
    };

    // 🔹 Tambahkan total ke setiap node ancestor
    const addTotalRecursive = (loc: Location): Location & { total_capacity: number } => ({
      ...loc,
      total_capacity: calcTotal(loc),
      children: loc.children?.map(addTotalRecursive) ?? [],
    });

    return addTotalRecursive(tree);
  }


}
