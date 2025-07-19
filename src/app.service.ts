import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'UCE Date Backend API - ¡Bienvenido a la API de citas de la UCE!';
  }

  getApiInfo(): object {
    return {
      name: 'UCE Date Backend API',
      version: '1.0.0',
      description:
        'API para la aplicación de citas de la Universidad Central del Ecuador',
      endpoints: {
        users: '/users',
        health: '/',
      },
      database: 'Supabase PostgreSQL',
    };
  }
}
