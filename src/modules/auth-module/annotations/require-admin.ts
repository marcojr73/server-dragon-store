import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin-guard';

export const REQUIRE_ADMIN_KEY = 'requireAdmin';

export function RequireAdmin() {
  return applyDecorators(
    SetMetadata(REQUIRE_ADMIN_KEY, true),
    UseGuards(AdminGuard),
  );
}
