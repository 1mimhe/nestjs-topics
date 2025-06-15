import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

interface ClassConstructor {
  new (): {}
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

// Custom interceptor
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Run something before a request handled
    // by the request handler.
    
    return next.handle().pipe(
      map((data: ClassConstructor) => {
        // Run something before the response in sent out.
        // incoming: instance of User entity => instance of UserDto
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true
          // This option requires that each property on the target class
          // has at least one @Expose() or @Exclude() assigned from this library.
        }); 
      })
    );
  }
}