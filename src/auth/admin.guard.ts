// src/auth/admin.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Only admin can perform this action');
    }
    return true;
  }
}
