# 🌍 Sistema de Configuración de Ambientes

## Descripción General

Este framework utiliza un sistema centralizado de configuración de ambientes que te permite cambiar fácilmente entre diferentes ambientes (dev, qa, prod) con configuraciones específicas por ambiente.

## Estructura

```
src/config/
├── interfaces/
│   └── IEnvironmentConfig.ts          # Interfaz de configuración
├── environments/
│   ├── index.ts                       # Punto de entrada principal
│   ├── dev.config.ts                  # Ambiente de desarrollo
│   ├── qa.config.ts                   # Ambiente QA/Test
│   └── prod.config.ts                 # Ambiente de producción
├── environment.config.ts              # Registro de ambientes
├── browser.config.ts                  # Configuración de navegador (usa config de env)
├── test.config.js                     # Config de ejecución de tests (usa config de env)
└── testdata.config.ts               # Configuración de datos de prueba
```

## Inicio Rápido

### Cambiar de Ambiente

Configura la variable `ENV` para cambiar entre ambientes:

```bash
# Desarrollo (default)
ENV=dev npm test

# QA/Test
ENV=qa npm test

# Producción
ENV=prod npm test
```

### Configuraciones Específicas por Ambiente

Cada ambiente tiene su propia configuración con valores predeterminados sensatos:

#### Desarrollo (dev)
```typescript
{
  headless: false,              // Navegador visible para debugging
  workers: 4,                   // Ejecución paralela
  retries: 2,                   // Reintentar tests fallidos
  enableVideos: true,           // Grabar videos
  enableScreenshots: true,      // Capturar screenshots
  timeout: {
    default: 30000,            // 30 segundos
    short: 10000,              // 10 segundos
    long: 60000                // 1 minuto
  },
  logger: { level: 'info' }
}
```

#### QA (qa/test)
```typescript
{
  headless: true,               // Headless por defecto
  workers: 4,                   // Ejecución paralela
  retries: 2,                   // Reintentar tests inestables
  enableVideos: true,           // Debugging completo
  enableScreenshots: true,
  timeout: {
    default: 30000,
    short: 10000,
    long: 60000
  },
  logger: { level: 'info', type: 'composite' }  // Consola + archivo
}
```

#### Producción (prod)
```typescript
{
  headless: true,               // Siempre headless
  workers: 2,                   // Paralelismo limitado
  retries: 0,                   // Fail fast
  enableVideos: false,          // Optimización de rendimiento
  enableScreenshots: true,      // Mantener evidencia de fallos
  timeout: {
    default: 20000,            // Timeouts más estrictos
    short: 5000,
    long: 40000
  },
  logger: { level: 'warn', type: 'file' }  // Solo archivo
}
```

## Ejemplos de Uso

### Uso Básico

```bash
# Usar ambiente por defecto (dev)
npm test

# Especificar ambiente explícitamente
ENV=qa npm test
ENV=prod npm test

# Sobrescribir configuraciones específicas
ENV=prod WORKERS=4 npm test
ENV=qa HEADLESS=false npm test
```

### En Código

```typescript
// Importar configuración del ambiente actual
import { config } from '@config/environments';

// Acceder a la configuración
console.log(config.baseURL);
console.log(config.timeout.default);
console.log(config.execution.workers);

// Obtener información del ambiente
import { getCurrentEnvironmentName } from '@config/environments';
console.log(`Ejecutando en: ${getCurrentEnvironmentName()}`);
```

### Ambiente Personalizado

Crear una nueva configuración de ambiente:

```typescript
// src/config/environments/staging.config.ts
import { IEnvironmentConfig } from '../interfaces/IEnvironmentConfig';
import { registerEnvironment } from '../environment.config';

export const stagingConfig: IEnvironmentConfig = {
  baseURL: 'https://staging.example.com',
  headless: true,
  timeout: {
    default: 25000,
    short: 8000,
    long: 50000
  },
  execution: {
    retries: 1,
    workers: 3
  },
  browser: {
    slowMo: 0,
    ignoreHTTPSErrors: true,
    viewport: null
  },
  features: {
    enableScreenshots: true,
    enableVideos: true,
    enableTracing: false
  },
  logger: {
    level: 'info',
    type: 'composite',
    filePath: 'reports/logs/staging.log'
  }
};

registerEnvironment('staging', stagingConfig);
export default stagingConfig;
```

Luego importarlo en `environments/index.ts`:

```typescript
import './staging.config';
```

## Propiedades de Configuración

### Configuración de URL
- `baseURL` - URL base de la aplicación
- `apiURL` - URL del endpoint de API (opcional)

### Configuración de Navegador
- `headless` - Ejecutar navegador en modo headless
- `browser.slowMo` - Ralentizar operaciones (ms)
- `browser.ignoreHTTPSErrors` - Ignorar errores de certificado HTTPS
- `browser.viewport` - Tamaño del viewport del navegador (null = maximizado)

### Configuración de Timeouts
- `timeout.default` - Timeout por defecto para la mayoría de operaciones
- `timeout.short` - Acciones rápidas (clicks, inputs)
- `timeout.long` - Operaciones pesadas (cargas de página, llamadas API)

### Configuración de Ejecución
- `execution.workers` - Número de workers paralelos
- `execution.retries` - Número de intentos de reintento para tests fallidos

### Toggles de Características
- `features.enableScreenshots` - Capturar screenshots en fallos
- `features.enableVideos` - Grabar videos de ejecución de tests
- `features.enableTracing` - Habilitar tracing de Playwright

### Configuración de Logger
- `logger.level` - Nivel de log: 'debug', 'info', 'warn', 'error'
- `logger.type` - Tipo de salida: 'console', 'file', 'composite'
- `logger.filePath` - Ruta del archivo de log

### Usuarios de Prueba
- `users.standard` - Credenciales de usuario estándar
- `users.locked` - Credenciales de usuario bloqueado
- Se pueden agregar tipos de usuario personalizados según sea necesario

## Sobrescritura con Variables de Ambiente

Todas las configuraciones pueden ser sobrescritas mediante variables de ambiente:

```bash
ENV=dev \
WORKERS=2 \
RETRY_ATTEMPTS=3 \
HEADLESS=true \
SLOW_MO=100 \
ENABLE_TRACING=true \
npm test
```

## Beneficios

✅ **Configuración Centralizada** - Única fuente de verdad  
✅ **Aislamiento de Ambientes** - Separación limpia de responsabilidades  
✅ **Seguridad de Tipos** - Las interfaces TypeScript aseguran corrección  
✅ **Flexibilidad** - Fácil agregar nuevos ambientes  
✅ **Capacidad de Sobrescritura** - Las variables de ambiente pueden sobrescribir defaults  
✅ **Mantenibilidad** - Actualizar un archivo en lugar de muchos  
✅ **Documentación** - Estructura de configuración auto-documentada  

## Mejores Prácticas

1. **Usar el ambiente correcto para la tarea**:
   - `dev` para desarrollo local y debugging
   - `qa` para pruebas de integración y CI/CD
   - `prod` para smoke tests de producción

2. **Sobrescribir con moderación**:
   - Usar variables de ambiente solo cuando sea necesario
   - Crear nuevas configuraciones de ambiente para cambios persistentes

3. **Mantener configuraciones DRY**:
   - Extraer configuraciones comunes a configuración compartida
   - Usar variables de ambiente para valores que cambian

4. **Documentar ambientes personalizados**:
   - Agregar comentarios explicando propósito y casos de uso
   - Listar cualquier requisito especial o dependencia

## Migración desde Configuración Antigua

Si tienes código usando el formato de config antiguo, actualiza las importaciones:

```typescript
// Antiguo
import { config } from '../config/env.config';

// Nuevo
import { config } from '../config/environments';

// El uso permanece igual
config.baseURL
config.timeout
```

## Solución de Problemas

**Problema**: Los tests usan el ambiente incorrecto  
**Solución**: Verifica que la variable `ENV` esté configurada correctamente
```bash
echo $ENV  # Linux/Mac
echo %ENV%  # Windows CMD
$env:ENV   # Windows PowerShell
```

**Problema**: La configuración no se carga  
**Solución**: Asegura que todas las configuraciones de ambiente estén importadas en `environments/index.ts`

**Problema**: Errores de TypeScript  
**Solución**: Reconstruye el proyecto
```bash
npx tsc --build --force
```

## Ver También

- [test.config.js](./test.config.js) - Configuración de ejecución de tests
- [browser.config.ts](./browser.config.ts) - Configuraciones específicas de navegador
- [TEST_CONFIG.md](./TEST_CONFIG.md) - Documentación de configuración de tests
