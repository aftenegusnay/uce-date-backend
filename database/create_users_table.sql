-- Tabla de usuarios para la aplicación UCE Date
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  email_uce VARCHAR(255) UNIQUE NOT NULL CHECK (email_uce LIKE '%@uce.edu.ec'),
  nombre_completo VARCHAR(255) NOT NULL,
  carrera VARCHAR(255) NOT NULL,
  semestre INTEGER NOT NULL CHECK (semestre >= 1 AND semestre <= 10),
  foto_perfil TEXT,
  estado TEXT,
  fecha_nacimiento DATE NOT NULL,
  genero VARCHAR(20) NOT NULL CHECK (genero IN ('masculino', 'femenino', 'otro')),
  preferencia_genero VARCHAR(20) NOT NULL CHECK (preferencia_genero IN ('masculino', 'femenino', 'ambos')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email_uce ON users(email_uce);
CREATE INDEX IF NOT EXISTS idx_users_genero ON users(genero);
CREATE INDEX IF NOT EXISTS idx_users_preferencia_genero ON users(preferencia_genero);
CREATE INDEX IF NOT EXISTS idx_users_carrera ON users(carrera);
CREATE INDEX IF NOT EXISTS idx_users_semestre ON users(semestre);

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at cuando se modifica un registro
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentar la tabla
COMMENT ON TABLE users IS 'Tabla de usuarios de la aplicación UCE Date';
COMMENT ON COLUMN users.user_id IS 'Identificador único del usuario (auto incrementable)';
COMMENT ON COLUMN users.email_uce IS 'Email institucional @uce.edu.ec';
COMMENT ON COLUMN users.nombre_completo IS 'Nombre completo del estudiante';
COMMENT ON COLUMN users.carrera IS 'Carrera que estudia el usuario';
COMMENT ON COLUMN users.semestre IS 'Semestre actual del usuario';
COMMENT ON COLUMN users.foto_perfil IS 'URL de la foto de perfil del usuario';
COMMENT ON COLUMN users.estado IS 'Descripción personal del usuario';
COMMENT ON COLUMN users.fecha_nacimiento IS 'Fecha de nacimiento del usuario';
COMMENT ON COLUMN users.genero IS 'Género del usuario';
COMMENT ON COLUMN users.preferencia_genero IS 'Preferencia de género para matches';
COMMENT ON COLUMN users.created_at IS 'Fecha y hora de creación del registro';
COMMENT ON COLUMN users.updated_at IS 'Fecha y hora de última actualización del registro';
