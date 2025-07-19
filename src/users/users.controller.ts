import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { StorageService } from '../storage/storage.service';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  ProfilePictureResponse,
} from './interfaces/user.interface';

interface UploadedFileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.getUserByEmail(email);
  }

  @Get(':id/matches')
  async getUserMatches(@Param('id', ParseIntPipe) id: number): Promise<User[]> {
    return this.usersService.getUsersByPreferences(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    const userId = parseInt(id, 10);
    await this.usersService.deleteUser(userId);
    return { message: 'Usuario eliminado exitosamente' };
  }

  // 📸 Endpoints para manejo de fotos de perfil
  @Post(':id/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @Param('id', ParseIntPipe) userId: number,
    @UploadedFile() file: UploadedFileType,
  ): Promise<ProfilePictureResponse> {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Convertir el archivo a la interfaz esperada por StorageService
    const multerFile = {
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer,
    };

    // Subir imagen y obtener resultado
    const uploadResult = await this.storageService.uploadProfilePicture(
      multerFile,
      userId.toString(),
    );

    // Actualizar usuario con nueva URL de foto
    const updatedUser = await this.usersService.updateUser(userId, {
      foto_perfil: uploadResult.publicUrl,
    });

    return {
      message: 'Foto de perfil actualizada exitosamente',
      url: uploadResult.publicUrl,
      user: updatedUser,
    };
  }

  @Delete(':id/profile-picture')
  async removeProfilePicture(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<{ message: string; user: User }> {
    // Obtener usuario actual
    const user = await this.usersService.getUserById(userId);

    // Eliminar imagen de Supabase si existe
    if (user.foto_perfil) {
      // Extraer path del URL público para eliminar
      const urlParts = user.foto_perfil.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `profile-pictures/${fileName}`;
      await this.storageService.deleteFile(filePath);
    }

    // Actualizar usuario removiendo la URL
    const updatedUser = await this.usersService.updateUser(userId, {
      foto_perfil: undefined,
    });

    return {
      message: 'Foto de perfil eliminada exitosamente',
      user: updatedUser,
    };
  }
}
