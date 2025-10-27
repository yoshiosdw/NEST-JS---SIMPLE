import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { Profile } from '../profile/profile.entity';
import { Role } from '../role/role.entity';
import { AppDataSource } from './data-source';

export async function seedAdmin(dataSource?: DataSource) {
  let ds: DataSource | null = null;

  try {
    ds = dataSource || (await AppDataSource.initialize());
    const userRepo = ds.getRepository(User);
    const profileRepo = ds.getRepository(Profile);
    const roleRepo = ds.getRepository(Role);

    const existingAdmin = await userRepo.findOne({ where: { email: 'admin' } });
    if (existingAdmin) {
      console.log('✅ Admin sudah ada, dilewati');
      if (!dataSource) await ds.destroy();
      return;
    }

    const adminRole = await roleRepo.findOne({ where: { name: 'administrator' } });
    if (!adminRole) throw new Error('Role "administrator" belum ada.');

    const adminProfile = profileRepo.create({
      fullName: 'Administrator',
      address: 'Admin Address',
    });
    await profileRepo.save(adminProfile);

    const hashedPassword = await bcrypt.hash('password', 10);

    const adminUser = userRepo.create({
      email: 'admin',
      password: hashedPassword,
      role: adminRole,        // ✅ ini langsung object Role
      profile: adminProfile,  // ✅ ini langsung object Profile
    });

    await userRepo.save(adminUser);

    console.log('✅ Admin default berhasil dibuat');

    if (!dataSource) await ds.destroy();
  } catch (err) {
    console.error('❌ Gagal membuat admin default:', err);
    if (ds && !dataSource) await ds.destroy();
  }
}

if (require.main === module) {
  seedAdmin();
}
