# 🚀 Guía de Despliegue en Render

## Prerrequisitos

- Cuenta en [Render](https://render.com)
- Proyecto subido a GitHub
- Proyecto Supabase configurado

## Pasos para el Despliegue

### 1. **Conectar Repositorio**

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `uce-date-backend`

### 2. **Configuración Básica**

```
Name: uce-date-backend
Environment: Node
Region: Oregon (US West) - o el más cercano
Branch: main
Build Command: npm install && npm run build
Start Command: npm run start:prod
```

### 3. **Variables de Entorno**

En la sección "Environment Variables", agrega:

| Clave               | Valor                        |
| ------------------- | ---------------------------- |
| `NODE_ENV`          | `production`                 |
| `PORT`              | `10000`                      |
| `SUPABASE_URL`      | Tu URL de Supabase           |
| `SUPABASE_ANON_KEY` | Tu clave anónima de Supabase |

### 4. **Obtener Credenciales de Supabase**

1. Ve a tu [Dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a Settings → API
4. Copia:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`

### 5. **Plan de Servicio**

- Para desarrollo: **Free Plan** (0$/mes, con limitaciones)
- Para producción: **Starter Plan** ($7/mes)

### 6. **Configuración Avanzada (Opcional)**

```yaml
# Auto-Deploy: Activado
# Health Check Path: /
# Docker: Desactivado (usamos Node.js nativo)
```

## URLs de Ejemplo

- **Desarrollo**: `https://uce-date-backend.onrender.com`
- **API Endpoints**:
  - `GET /users` - Listar usuarios
  - `POST /users` - Crear usuario
  - `POST /users/:id/profile-picture` - Subir foto

## Monitoreo

- **Logs**: Dashboard de Render → tu servicio → Logs
- **Métricas**: Dashboard de Render → tu servicio → Metrics
- **Status**: Automático health checks cada 30 segundos

## Troubleshooting

### Error: "Module not found"

```bash
# Verifica que todas las dependencias estén en package.json
npm install
npm run build
```

### Error: "Port already in use"

```bash
# Render maneja automáticamente el puerto
# No cambies PORT en el código, usa process.env.PORT
```

### Error: "Supabase connection failed"

```bash
# Verifica las variables de entorno
# Asegúrate que SUPABASE_URL y SUPABASE_ANON_KEY sean correctas
```

## Comandos Útiles

### Logs en tiempo real

```bash
# Desde el dashboard de Render
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.render.com/v1/services/YOUR_SERVICE_ID/logs
```

### Redeploy manual

```bash
# Push a main branch o usa el botón "Manual Deploy" en Render
git push origin main
```

## Configuración de CORS (si usas frontend)

En `main.ts`:

```typescript
app.enableCors({
  origin: ['https://tu-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true,
});
```

## Consideraciones de Seguridad

- ✅ Variables de entorno protegidas
- ✅ HTTPS automático
- ✅ No exponer claves en el código
- ⚠️ Usar Service Key solo para operaciones admin

## Costos Estimados

- **Free Plan**: $0/mes (limitaciones de CPU/RAM)
- **Starter Plan**: $7/mes (recomendado para producción)
- **Pro Plan**: $25/mes (para apps de alto tráfico)
