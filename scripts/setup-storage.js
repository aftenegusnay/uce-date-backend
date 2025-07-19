const { createClient } = require('@supabase/supabase-js');

async function setupStorage() {
  console.log('🔧 Configurando Storage de Supabase...');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log(
      '⚠️ Variables de entorno de Supabase no encontradas. Saltando setup de storage.',
    );
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Verificar si el bucket ya existe
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.log('ℹ️ No se pudo verificar buckets existentes, continuando...');
    }

    const bucketExists = buckets?.some(
      (bucket) => bucket.name === 'profile-pictures',
    );

    if (bucketExists) {
      console.log('✅ Bucket profile-pictures ya existe');
      return;
    }

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

    if (bucketError) {
      if (bucketError.message?.includes('already exists')) {
        console.log('✅ Bucket profile-pictures ya existe');
      } else {
        console.log('⚠️ Error creando bucket:', bucketError.message);
      }
    } else {
      console.log('✅ Bucket profile-pictures creado exitosamente');
    }

    console.log('🎉 Setup de Storage completado');
  } catch (error) {
    console.log('⚠️ Error en setup de storage:', error.message);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  setupStorage().catch(console.error);
}

module.exports = { setupStorage };
