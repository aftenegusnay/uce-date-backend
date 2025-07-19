import { Injectable } from '@nestjs/common';

export interface ApiInfo {
  name: string;
  version: string;
  description: string;
  endpoints: {
    users: string;
    health: string;
    info: string;
  };
  database: string;
  features: string[];
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'UCE Date Backend API - ¡Bienvenido a la API de citas de la UCE!';
  }

  getApiInfo(): ApiInfo {
    return {
      name: 'UCE Date Backend API',
      version: '1.0.0',
      description:
        'API para la aplicación de citas de la Universidad Central del Ecuador',
      endpoints: {
        users: '/users',
        health: '/',
        info: '/info',
      },
      database: 'Supabase PostgreSQL',
      features: [
        'Gestión de usuarios UCE',
        'Sistema de matching por preferencias',
        'Validación de emails institucionales',
        'CRUD completo de usuarios',
        'Filtrado por género y preferencias',
      ],
    };
  }

  getHealth(): HealthResponse {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
