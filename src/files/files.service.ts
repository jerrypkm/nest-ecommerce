import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class FilesService {
  constructor(
    @Inject(CloudinaryService)
    private readonly _cloudinaryService: CloudinaryService,
  ) {}
  async uploadFile(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se encontró un archivo');
    try {
      await this._cloudinaryService.uploadImage(file);

      return { fileName: file.originalname };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }
}
