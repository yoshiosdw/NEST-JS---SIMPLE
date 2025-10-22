import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../abilities/ability.factory';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const ability = this.abilityFactory.defineAbility(user);

    // Contoh: Check action dan subject dari metadata
    const action = this.reflector.get<string>('action', context.getHandler());
    const subject = this.reflector.get<string>('subject', context.getHandler());

    ForbiddenError.from(ability).throwUnlessCan(action || 'read', subject || 'all');
    return true;
  }
}