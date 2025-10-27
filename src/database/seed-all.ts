import { AppDataSource } from './data-source';
import { seedRoles } from './seed-roles';
import { seedAdmin } from './seed-admin';

async function seedAll() {
  const dataSource = await AppDataSource.initialize();

  try {
    console.log('🚀 Menjalankan semua seeder...');
    await seedRoles(dataSource);
    await seedAdmin(dataSource);
    console.log('🎉 Semua seed berhasil dijalankan');
  } catch (err) {
    console.error('❌ Gagal menjalankan seed:', err);
  } finally {
    await dataSource.destroy();
  }
}

seedAll();
