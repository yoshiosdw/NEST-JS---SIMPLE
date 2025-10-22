import { Module } from '@nestjs/common';
import { AbilityFactory } from './abilities/ability.factory';

@Module({
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class CommonModule {}
