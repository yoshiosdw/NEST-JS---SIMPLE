// src/common/abilities/ability.module.ts
import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';

@Module({
  providers: [AbilityFactory],
  exports: [AbilityFactory], // export supaya bisa dipakai di modul lain
})
export class AbilityModule {}
