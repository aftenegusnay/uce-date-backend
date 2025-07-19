import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';

export interface UploadResult {
  url: string;
  publicUrl: string;
  path: string;
  filename: string;
}

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  destination?: string;
  filename?: string;
  path?: string;
}

@Injectable()
export class StorageService {
  private readonly bucketName = 'profile-pictures';

  constructor(private readonly supabaseService: SupabaseService) {}

  async uploadProfilePicture(
    file: MulterFile,
    userId: string,
  ): Promise<UploadResult> {
    try {
      // Validar el archivo
      this.validateFile(file);

      // Procesar la imagen
      const processedBuffer = await this.processImage(file.buffer);

      // Generar nombre único para el archivo
      const fileExtension = this.getFileExtension(file.originalname);
      const filename = `${userId}_${uuidv4()}.${fileExtension}`;
      const filePath = `profile-pictures/${filename}`;

      // Subir a Supabase Storage
      const { data, error } = await this.supabaseService
        .getClient()
        .storage.from('profile-pictures')
        .upload(filePath, processedBuffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.mimetype,
        });

      if (error) {
        throw new BadRequestException(
          `Error subiendo imagen: ${error.message}`,
        );
      }

      // Obtener URL pública
      const {
        data: { publicUrl },
      } = this.supabaseService
        .getClient()
        .storage.from('profile-pictures')
        .getPublicUrl(filePath);

      return {
        url: data.path,
        publicUrl,
        path: filePath,
        filename,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Error procesando imagen: ${errorMessage}`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .storage.from('profile-pictures')
        .remove([filePath]);

      if (error) {
        console.warn(`Error eliminando imagen: ${error.message}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      console.warn(`Error eliminando imagen: ${errorMessage}`);
    }
  }

  private async cleanupOldProfilePictures(userId: string): Promise<void> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .storage.from('profile-pictures')
        .list('', {
          search: userId,
        });

      if (error) return;

      const filesToDelete = data?.map((file) => file.name) || [];
      if (filesToDelete.length > 0) {
        await this.supabaseService
          .getClient()
          .storage.from('profile-pictures')
          .remove(filesToDelete);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      console.warn(`Error eliminando fotos anteriores: ${errorMessage}`);
    }
  }

  private validateFile(file: MulterFile): void {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, WebP',
      );
    }

    if (file.size > maxSize) {
      throw new BadRequestException(
        'El archivo es demasiado grande. Máximo permitido: 5MB',
      );
    }

    if (file.size === 0) {
      throw new BadRequestException('El archivo está vacío');
    }
  }

  private async processImage(buffer: Buffer): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize(400, 400, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({
          quality: 85,
          progressive: true,
        })
        .toBuffer();
    } catch {
      throw new BadRequestException('Error procesando la imagen');
    }
  }

  private getFileExtension(filename: string): string {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };

    try {
      const ext = filename.split('.').pop()?.toLowerCase();
      return ext && Object.values(mimeToExt).includes(ext) ? ext : 'jpg';
    } catch {
      return 'jpg';
    }
  }
}
