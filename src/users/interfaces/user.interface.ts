export interface User {
  user_id?: number; // Auto incrementable (PK)
  email_uce: string; // Email institucional @uce.edu.ec
  nombre_completo: string; // Nombre completo del estudiante
  carrera: string; // Carrera que estudia
  semestre: number; // Semestre actual
  foto_perfil?: string; // URL de la foto de perfil
  estado?: string; // Descripción personal
  fecha_nacimiento: Date; // Fecha de nacimiento del usuario
  genero: 'masculino' | 'femenino' | 'otro'; // Género
  preferencia_genero: 'masculino' | 'femenino' | 'ambos'; // Preferencia de género
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserDto {
  email_uce: string;
  nombre_completo: string;
  carrera: string;
  semestre: number;
  foto_perfil?: string;
  estado?: string;
  fecha_nacimiento: Date;
  genero: 'masculino' | 'femenino' | 'otro';
  preferencia_genero: 'masculino' | 'femenino' | 'ambos';
}

export interface UpdateUserDto {
  nombre_completo?: string;
  carrera?: string;
  semestre?: number;
  foto_perfil?: string;
  estado?: string;
  fecha_nacimiento?: Date;
  genero?: 'masculino' | 'femenino' | 'otro';
  preferencia_genero?: 'masculino' | 'femenino' | 'ambos';
}

// Nuevas interfaces para manejo de archivos
export interface UploadProfilePictureDto {
  userId: number;
}

export interface ProfilePictureResponse {
  message: string;
  url: string;
  user: User;
}
