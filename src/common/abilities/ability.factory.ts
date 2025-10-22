import { Injectable } from '@nestjs/common';
import { AbilityBuilder, Ability, createMongoAbility } from '@casl/ability';

@Injectable()
export class AbilityFactory {
  defineAbility(user: any) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.role === 'admin') {
      can('manage', 'all');  // Admin bisa semua
    } else {
      can('read', 'Task');  // User bisa read task
      can('read', 'Profile', { userId: user.userId });  // Hanya profile sendiri
      cannot('create', 'Task');  // Contoh restriction
    }

    return build();
  }
}