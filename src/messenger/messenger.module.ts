import { Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { MessengerGateway } from './messenger.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [MessengerGateway, MessengerService],
  imports: [AuthModule],
})
export class MessengerModule {}
