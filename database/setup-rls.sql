-- Script para configurar políticas de acceso en Supabase
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase

-- 1. Deshabilitar RLS temporalmente para desarrollo
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Verificar que la tabla existe y su estructura
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- 3. Insertar un usuario de prueba
INSERT INTO users (
    email_uce, 
    nombre_completo, 
    carrera, 
    semestre, 
    fecha_nacimiento, 
    genero, 
    preferencia_genero,
    estado
) VALUES (
    'test@uce.edu.ec',
    'Usuario de Prueba',
    'Ingeniería en Sistemas',
    7,
    '2000-01-15',
    'masculino',
    'femenino',
    'Usuario de prueba para verificar la conexión'
);

-- 4. Verificar que el usuario se insertó correctamente
SELECT * FROM users WHERE email_uce = 'test@uce.edu.ec';
