import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// Custom param decorator
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext /* Http, Grpc,... */) => {
    // data => the argument we pass to the decorator => @CurrentUser(data)
    const request = context.switchToHttp().getRequest();
    return request.user;
  }
);

// Param decorators exists outside the DI system,
// so our decorator can't get an instance of UserService directly.
// We use a custom interceptor that attach the user to the request.