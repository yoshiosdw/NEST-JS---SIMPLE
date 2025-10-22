import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { Profile } from '../profile/profile.entity';
import { AppDataSource } from './data-source';

async function seedAdmin() {
  try {
    // Inisialisasi koneksi database
    const dataSource: DataSource = await AppDataSource.initialize();

    const userRepo = dataSource.getRepository(User);
    const profileRepo = dataSource.getRepository(Profile);

    // Cek apakah admin sudah ada
    const existingAdmin = await userRepo.findOne({ where: { email: 'admin@example.com' } });
    if (existingAdmin) {
      console.log('Admin sudah ada, seeder dilewati');
      await dataSource.destroy();
      return;
    }

    // Buat profile untuk admin (boleh kosong atau default)
   const adminProfile = profileRepo.create({
  address: 'Admin Address',
  fullName: 'Administrator',
  nik: undefined, // atau bisa dihilangkan saja
});

    await profileRepo.save(adminProfile);

    // Hash password admin
    const hashedPassword = await bcrypt.hash('password', 10);

    // Buat admin user
    const adminUser = userRepo.create({
      email: 'admin',
      password: hashedPassword,
      role: 'admin',
      profile: adminProfile,
    });

    await userRepo.save(adminUser);

    console.log('Admin default berhasil dibuat');
    await dataSource.destroy();
  } catch (err) {
    console.error('Gagal membuat admin default:', err);
  }
}

// Jalankan seeder
seedAdmin();
