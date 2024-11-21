import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/fetch.adapter';

@Module({
  providers: [AxiosAdapter],
  exports: [AxiosAdapter],
})
export class CommonModule {}
