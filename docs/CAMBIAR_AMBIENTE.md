# 🌍 Guía Rápida: Cambiar de Ambiente

## Opción 1: Modificar archivo .env (Recomendado para desarrollo)

Edita el archivo `.env` en la raíz del proyecto y cambia la variable `ENV`:

```bash
# Para desarrollo local (default)
ENV=dev

# Para QA/Testing
ENV=qa

# Para producción
ENV=prod
```

Después simplemente ejecuta:
```bash
npm test
```

## Opción 2: Variable de entorno temporal (Recomendado para CI/CD)

### Windows PowerShell
```powershell
# Desarrollo
$env:ENV='dev'; npm test

# QA
$env:ENV='qa'; npm test

# Producción
$env:ENV='prod'; npm test

# Con tags específicos
$env:ENV='prod'; npm run test:any '@critical'
```

### Linux/Mac/Git Bash
```bash
# Desarrollo
ENV=dev npm test

# QA
ENV=qa npm test

# Producción
ENV=prod npm test

# Con tags específicos
ENV=prod npm run test:any '@critical'
```

## Características de cada ambiente

### 🔧 Development (dev)
- **Workers**: 4 paralelos
- **Retries**: 2 intentos
- **Headless**: No (browser visible)
- **Videos**: ✅ Activados
- **Screenshots**: ✅ Activados
- **Timeouts**: Más permisivos (30s/10s/60s)
- **Logging**: Info level (detallado)
- **Uso**: Desarrollo local y debugging

### 🧪 QA (qa)
- **Workers**: 4 paralelos
- **Retries**: 2 intentos
- **Headless**: Sí
- **Videos**: ✅ Activados
- **Screenshots**: ✅ Activados
- **Timeouts**: Balanceados (30s/10s/60s)
- **Logging**: Info level (console + archivo)
- **Uso**: Pipelines CI/CD, testing automatizado

### 🚀 Production (prod)
- **Workers**: 2 paralelos (limitado)
- **Retries**: 0 (fail fast)
- **Headless**: Sí (siempre)
- **Videos**: ❌ Desactivados (performance)
- **Screenshots**: ✅ Activados (evidencia)
- **Timeouts**: Estrictos (20s/5s/40s)
- **Logging**: Warn level (solo warnings/errors)
- **Uso**: Smoke tests en producción

## Verificar ambiente actual

Puedes verificar qué ambiente está configurado:

### Windows PowerShell
```powershell
Get-Content .env | Select-String "^ENV="
```

### Linux/Mac
```bash
grep "^ENV=" .env
```

## Ejemplos de uso común

```bash
# 1. Desarrollo local con browser visible
#    Edita .env: ENV=dev y HEADLESS=false
npm test

# 2. QA en CI/CD pipeline
ENV=qa npm test

# 3. Smoke tests en producción (2 workers, sin videos)
ENV=prod npm run test:smoke

# 4. Debug con ambiente específico
ENV=dev HEADLESS=false npm run test:any '@flaky'

# 5. Override de workers en ambiente prod
ENV=prod WORKERS=4 npm test

# 6. QA con 8 workers para suite grande
ENV=qa WORKERS=8 npm test
```

## Configuraciones adicionales por ambiente

Puedes sobrescribir cualquier configuración mediante variables de entorno:

```bash
# Cambiar número de workers
ENV=qa WORKERS=2 npm test

# Cambiar número de reintentos
ENV=dev RETRY_ATTEMPTS=3 npm test

# Modo headless específico
ENV=dev HEADLESS=true npm test

# Activar tracing en QA
ENV=qa ENABLE_TRACING=true npm test
```

## Troubleshooting

**Problema**: Los tests no usan el ambiente esperado  
**Solución**: Verifica que el archivo `.env` exista y tenga la variable `ENV` configurada

**Problema**: Cambios en `.env` no se reflejan  
**Solución**: Reinicia el proceso de Node.js o terminal. Los cambios en `.env` requieren reinicio.

**Problema**: Error "Environment not found"  
**Solución**: Verifica que el valor de `ENV` sea exactamente `dev`, `qa`, o `prod` (case-sensitive en algunos sistemas)

## Ver más información

- Documentación completa: [src/config/ENVIRONMENT_CONFIG.md](../src/config/ENVIRONMENT_CONFIG.md)
- Configuración de test: [src/config/TEST_CONFIG.md](../src/config/TEST_CONFIG.md)
