import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { EncryptAdapter } from '../interfaces';

@Injectable()
export class CryptAdapter implements EncryptAdapter {
  hashSync(text: string, salt: number): string {
    try {
      return bcrypt.hashSync(text, salt);
    } catch (err) {
      console.log(err);
      throw new Error('Error on encryption, check logs');
    }
  }

  compareSync(data: string, encrypted: string): boolean {
    try {
      return bcrypt.compareSync(data, encrypted);
    } catch (error) {
      console.log(error);
      throw new Error('Error on encryption, check logs');
    }
  }
}
