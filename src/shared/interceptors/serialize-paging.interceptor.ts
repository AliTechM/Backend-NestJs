import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function SerializePage(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const mails = handler.handle().pipe(
      map((InData: any) => {
        const data = plainToClass(this.dto, InData['data'], {
          excludeExtraneousValues: true,
        });
        return {
          data,
          total: InData['total'],
          page: InData['page'],
          last_page: InData['last_page'],
        };
      }),
    );
    return mails;
  }
}
