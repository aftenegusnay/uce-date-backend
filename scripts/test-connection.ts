import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

async function testConnection() {
  console.log('🔄 Probando conexión a Supabase...');

  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);
    // Intentar obtener usuarios (debería devolver array vacío si no hay datos)
    const users = await usersService.getAllUsers();
    console.log('✅ Conexión exitosa a Supabase!');
    console.log(`📊 Usuarios encontrados: ${users.length}`);

    await app.close();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido';
    console.error('❌ Error de conexión:', errorMessage);
    console.error('🔍 Verifica:');
    console.error('  - Las credenciales en el archivo .env');
    console.error('  - Que la tabla "users" existe en Supabase');
    console.error('  - Las políticas de seguridad (RLS)');

    // Mostrar más detalles del error si está disponible
    if (error instanceof Error && error.stack) {
      console.error('📋 Stack trace:', error.stack);
    }
  }
}

testConnection().catch((error) => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
