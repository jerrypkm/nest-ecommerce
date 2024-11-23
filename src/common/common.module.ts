import { Module } from '@nestjs/common';
import { AxiosAdapter, CryptAdapter } from './adapters';
import { PostgresExceptionHandler } from './exceptions/postgres-handler.exception';

@Module({
  providers: [AxiosAdapter, PostgresExceptionHandler, CryptAdapter],
  exports: [AxiosAdapter, PostgresExceptionHandler, CryptAdapter],
})
export class CommonModule {}
