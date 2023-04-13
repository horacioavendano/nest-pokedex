
import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@nestjs/common';
import { HttpAdapter } from '../interfaces/http-adapter.interfaces';
import https from 'https';


@Injectable()
export class AxiosAdapter implements HttpAdapter {
    private axios: AxiosInstance = axios.create({
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      });

    async get<T>(url: string): Promise<T> {

        try {
            const { data } = await this.axios.get<T>(url);
            return data;
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              }
            throw new Error(error);
        }
    }

}