import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  uploadFile(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se encontró un archivo');

    return { fileName: file.originalname };
  }
}
