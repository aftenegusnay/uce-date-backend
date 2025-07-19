# UCE Date Backend - Configuración de Supabase

## Configuración Inicial

### 1. Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto

### 2. Configurar la base de datos

1. En tu proyecto de Supabase, ve a la sección "SQL Editor"
2. Ejecuta el script `database/create_users_table.sql` para crear la tabla de usuarios
3. Verifica que la tabla se haya creado correctamente

### 3. Configurar variables de entorno

1. En tu proyecto de Supabase, ve a "Settings" > "API"
2. Copia la URL del proyecto y las API keys
3. Actualiza el archivo `.env` con tus credenciales:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

### 4. Políticas de seguridad (RLS)

Por defecto, Supabase tiene Row Level Security (RLS) habilitado. Para desarrollo inicial, puedes:

1. Ir a "Authentication" > "Policies"
2. Para la tabla `users`, crear políticas básicas o deshabilitar RLS temporalmente
3. Para producción, configura políticas adecuadas de seguridad

## API Endpoints

### Usuarios

- `POST /users` - Crear nuevo usuario
- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `GET /users/email/:email` - Obtener usuario por email
- `GET /users/:id/matches` - Obtener usuarios compatibles según preferencias
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Ejemplo de payload para crear usuario:

```json
{
  "email_uce": "estudiante@uce.edu.ec",
  "nombre_completo": "Juan Pérez",
  "carrera": "Ingeniería en Sistemas",
  "semestre": 7,
  "foto_perfil": "https://ejemplo.com/foto.jpg",
  "estado": "Buscando conocer gente nueva",
  "fecha_nacimiento": "2000-05-15",
  "genero": "masculino",
  "preferencia_genero": "femenino"
}
```

## Comandos útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run start:dev

# Compilar el proyecto
npm run build

# Ejecutar tests
npm test

# Formatear código
npm run format

# Verificar linting
npm run lint
```

## Estructura del proyecto

```
src/
├── supabase/
│   └── supabase.service.ts    # Servicio de conexión a Supabase
├── users/
│   ├── interfaces/
│   │   └── user.interface.ts  # Interfaces y DTOs
│   ├── users.controller.ts    # Controlador de endpoints
│   ├── users.service.ts       # Lógica de negocio
│   └── users.module.ts        # Módulo de usuarios
├── app.module.ts              # Módulo principal
└── main.ts                    # Punto de entrada
```
