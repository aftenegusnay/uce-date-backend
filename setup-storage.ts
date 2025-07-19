// Script para crear el bucket de profile-pictures en Supabase
// Ejecutar este script una vez para configurar el almacenamiento

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service Role Key (no anon key)

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    '❌ Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log('🔧 Configurando Supabase Storage...');

    // 1. Crear bucket profile-pictures
    // Crear bucket si no existe
    console.log('📦 Creando bucket profile-pictures...');
    const { error: bucketError } = await supabase.storage.createBucket(
      'profile-pictures',
      {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880, // 5MB
      },
    );

    if (bucketError && !bucketError.message.includes('already exists')) {
      console.error('❌ Error creando bucket:', bucketError);
      return;
    }

    console.log('✅ Bucket profile-pictures creado/verificado');

    // 2. Configurar política de acceso público para lectura
    const policySQL = `
      -- Política para permitir lectura pública de imágenes de perfil
      CREATE POLICY "Profile pictures are publicly accessible" ON storage.objects
      FOR SELECT USING (bucket_id = 'profile-pictures');

      -- Política para permitir que usuarios autenticados suban imágenes
      CREATE POLICY "Users can upload profile pictures" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'profile-pictures');

      -- Política para permitir que usuarios autenticados actualicen sus imágenes
      CREATE POLICY "Users can update their profile pictures" ON storage.objects
      FOR UPDATE USING (bucket_id = 'profile-pictures');

      -- Política para permitir que usuarios autenticados eliminen sus imágenes
      CREATE POLICY "Users can delete their profile pictures" ON storage.objects
      FOR DELETE USING (bucket_id = 'profile-pictures');
    `;

    console.log('📋 Configuración completada!');
    console.log('');
    console.log(
      '📝 Ejecuta las siguientes políticas SQL en tu dashboard de Supabase:',
    );
    console.log('');
    console.log(policySQL);
    console.log('');
    console.log(
      '🌐 URL del bucket: ' +
        supabaseUrl +
        '/storage/v1/object/public/profile-pictures/',
    );
  } catch (error) {
    console.error('❌ Error en la configuración:', error);
  }
}

setupStorage().catch(console.error);
