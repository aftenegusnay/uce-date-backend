import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
} from './interfaces/user.interface';

// Definir el tipo de respuesta de Supabase
interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}

interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Validar que el email sea de la UCE
    if (!createUserDto.email_uce.endsWith('@uce.edu.ec')) {
      throw new BadRequestException(
        'El email debe ser institucional (@uce.edu.ec)',
      );
    }

    const supabase = this.supabaseService.getClient();

    const { data, error }: SupabaseResponse<User> = await supabase
      .from('users')
      .insert([
        {
          ...createUserDto,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw new BadRequestException(`Error al crear usuario: ${error.message}`);
    }

    if (!data) {
      throw new BadRequestException('No se pudo crear el usuario');
    }

    return data;
  }

  async getAllUsers(): Promise<User[]> {
    const supabase = this.supabaseService.getClient();

    const { data, error }: SupabaseResponse<User[]> = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(
        `Error al obtener usuarios: ${error.message}`,
      );
    }

    return data || [];
  }

  async getUserById(userId: number): Promise<User> {
    const supabase = this.supabaseService.getClient();

    const { data, error }: SupabaseResponse<User> = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    if (!data) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    return data;
  }

  async getUserByEmail(email: string): Promise<User> {
    const supabase = this.supabaseService.getClient();

    const { data, error }: SupabaseResponse<User> = await supabase
      .from('users')
      .select('*')
      .eq('email_uce', email)
      .single();

    if (error) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }

    if (!data) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }

    return data;
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const supabase = this.supabaseService.getClient();

    const { data, error }: SupabaseResponse<User> = await supabase
      .from('users')
      .update({
        ...updateUserDto,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(
        `Error al actualizar usuario: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    return data;
  }

  async deleteUser(userId: number): Promise<void> {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new BadRequestException(
        `Error al eliminar usuario: ${error.message}`,
      );
    }
  }

  async getUsersByPreferences(userId: number): Promise<User[]> {
    const currentUser = await this.getUserById(userId);
    const supabase = this.supabaseService.getClient();

    let query = supabase.from('users').select('*').neq('user_id', userId); // Excluir al usuario actual

    // Filtrar por preferencia de género
    if (currentUser.preferencia_genero !== 'ambos') {
      query = query.eq('genero', currentUser.preferencia_genero);
    }

    const { data, error }: SupabaseResponse<User[]> = await query.order(
      'created_at',
      {
        ascending: false,
      },
    );

    if (error) {
      throw new BadRequestException(
        `Error al obtener usuarios por preferencias: ${error.message}`,
      );
    }

    return data || [];
  }
}
