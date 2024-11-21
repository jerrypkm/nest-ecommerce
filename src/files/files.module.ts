import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [CloudinaryModule, CommonModule],
})
export class FilesModule {}
