import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth, ValidRoles } from 'src/auth';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(ValidRoles.admin)
  excecuteSeed() {
    return this.seedService.runSeed();
  }
}
