import { Injectable } from '@nestjs/common';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;
  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
    } catch (err) {
      console.log(err);
      throw new Error('Error on request, check logs');
    }
  }
}
