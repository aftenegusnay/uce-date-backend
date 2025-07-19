import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function diagnoseConnection() {
  console.log('🔍 Diagnóstico de conexión a Supabase...\n');

  // Verificar variables de entorno
  console.log('📋 Variables de entorno:');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log(
    'SUPABASE_ANON_KEY:',
    process.env.SUPABASE_ANON_KEY
      ? `${process.env.SUPABASE_ANON_KEY.substring(0, 20)}...`
      : 'NO DEFINIDA',
  );
  console.log(
    'SUPABASE_SERVICE_ROLE_KEY:',
    process.env.SUPABASE_SERVICE_ROLE_KEY
      ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...`
      : 'NO DEFINIDA',
  );
  console.log('');

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ Variables de entorno faltantes');
    return;
  }

  try {
    // Probar con clave anónima
    console.log('🔄 Probando conexión con clave anónima...');
    const supabaseAnon = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
    );

    const { data: anonData, error: anonError } = await supabaseAnon
      .from('users')
      .select('count', { count: 'exact' });

    if (anonError) {
      console.log('❌ Error con clave anónima:', anonError.message);
    } else {
      console.log('✅ Conexión exitosa con clave anónima');
      console.log('📊 Respuesta:', anonData);
    }

    console.log('');

    // Probar con service role si está disponible
    if (
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY !== process.env.SUPABASE_ANON_KEY
    ) {
      console.log('🔄 Probando conexión con service role...');
      const supabaseService = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
      );

      const { data: serviceData, error: serviceError } = await supabaseService
        .from('users')
        .select('count', { count: 'exact' });

      if (serviceError) {
        console.log('❌ Error con service role:', serviceError.message);
      } else {
        console.log('✅ Conexión exitosa con service role');
        console.log('📊 Respuesta:', serviceData);
      }
    } else {
      console.log(
        '⚠️  Service role key es igual a anon key o no está definida',
      );
    }

    console.log('');

    // Probar inserción simple
    console.log('🔄 Probando operación simple...');
    const testClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
    );

    const { data: selectData, error: selectError } = await testClient
      .from('users')
      .select('user_id, email_uce')
      .limit(1);

    if (selectError) {
      console.log('❌ Error en SELECT:', selectError.message);
      console.log('📋 Detalles:', selectError);
    } else {
      console.log('✅ SELECT exitoso');
      console.log('📊 Datos:', selectData);
    }
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

diagnoseConnection().catch(console.error);
