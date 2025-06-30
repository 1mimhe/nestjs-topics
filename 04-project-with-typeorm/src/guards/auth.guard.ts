import { CanActivate, ExecutionContext } from '@nestjs/common';

// Guard: Rejects requests to certain handlers if the user is not signed in.

export class AuthGuard implements CanActivate {
  // Return truthy value if user can access this route, falsy if not.
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.session.userId;
  }
}

// We can apply this guard to:
// - entire application
// - individual controllers
// - individual handlers