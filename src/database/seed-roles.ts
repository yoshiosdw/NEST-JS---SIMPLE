import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';
import { Role } from '../role/role.entity';

export async function seedRoles(dataSource?: DataSource) {
  let ds: DataSource | null = null;

  try {
    ds = dataSource || (await AppDataSource.initialize());
    const roleRepo = ds.getRepository(Role);

    const existingRole = await roleRepo.findOne({ where: { name: 'administrator' } });
    if (existingRole) {
      console.log('✅ Role "administrator" sudah ada');
      if (!dataSource) await ds.destroy();
      return existingRole;
    }

    const adminRole = roleRepo.create({
      name: 'administrator',
    });

    await roleRepo.save(adminRole);
    console.log('✅ Role "administrator" berhasil dibuat');
    if (!dataSource) await ds.destroy();

    return adminRole;
  } catch (error) {
    console.error('❌ Gagal membuat role "administrator":', error);
    if (ds && !dataSource) await ds.destroy();
  }
}

if (require.main === module) {
  seedRoles();
}
