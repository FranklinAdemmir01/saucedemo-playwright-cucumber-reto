# 📜 Directorio de Scripts

Scripts de utilidad para ejecución de tests y gestión de ambientes.

## Scripts Disponibles

### 🎯 Ejecución de Tests
**`run-tagged-tests.js`** - Ejecutar tests por tags personalizados
```bash
npm run test:any "@smoke"
npm run test:any "@critical" "@positive"
```

### 🌍 Gestión de Ambientes
**`set-environment.js`** - Cambiar entre ambientes
```bash
npm run env              # Mostrar actual
npm run env:dev          # Cambiar a dev
npm run env:qa           # Cambiar a QA
npm run env:prod         # Cambiar a producción
```

### 📊 Generación de Reportes
**`generate-report.js`** - Generar reportes HTML de tests
```bash
npm run report           # Generar desde último test
npm run test:report      # Ejecutar tests + generar reporte
```

**`simple-reporter.js`** - Reporter de consola ligero

---

## Uso

Todos los scripts se ejecutan mediante comandos npm en `package.json`.  
No ejecutar scripts directamente - usar comandos npm en su lugar.

Ver [README.md](../README.md) principal para documentación completa.

# 🎯 Scripts de Ejecución de Tests

Este directorio contiene scripts de utilidad para ejecutar tests con configuraciones personalizadas.

## run-tagged-tests.js

Script para ejecutar tests de Cucumber con tags personalizados de manera simplificada.

### Uso

#### PowerShell (Windows)
```powershell
# Tag único
npm run test:any '@smoke'
npm run test:any '@C45075-oaklawn'
npm run test:any '@critical'

# Múltiples tags (ejecuta tests que coincidan con CUALQUIERA de los tags)
npm run test:any '@smoke' '@critical'
npm run test:any '@positive' '@negative'
```

#### Bash/CMD (Linux/Mac)
```bash
# Tag único (comillas opcionales)
npm run test:any @smoke
npm run test:any @C45075-oaklawn

# Múltiples tags
npm run test:any @smoke @critical
```

### Características

- ✅ No necesita separador `--` (sintaxis más simple)
- ✅ Ejecuta tests en paralelo (4 workers)
- ✅ Soporta múltiples tags (lógica OR)
- ✅ Salida limpia y amigable
- ✅ Limpieza automática de videos/screenshots antiguos

### Ejemplos

```bash
# Ejecutar todos los tests con tag @smoke
npm run test:any '@smoke'

# Ejecutar tests con tag personalizado (ej: ticket JIRA)
npm run test:any '@C45075-oaklawn'

# Ejecutar tests críticos O positivos
npm run test:any '@critical' '@positive'

# Ejecutar tests de feature específico
npm run test:any '@login'
npm run test:any '@cart'
npm run test:any '@checkout'
```

### Lógica de Expresión de Tags

- **Tag único**: Ejecuta todos los tests con ese tag
- **Múltiples tags**: Ejecuta tests que coincidan con CUALQUIER tag (lógica OR)
- **Expresiones complejas**: Usar `npm run test:tag -- --tags "expression"` para lógica AND/NOT

### Manejo de Errores

Si no se proporcionan tags, el script muestra información de ayuda útil:

```
❌ Error: Por favor proporciona al menos un tag

Uso:
  PowerShell: npm run test:any '@tag'
  Bash/CMD:   npm run test:any @tag

Ejemplos:
  npm run test:any '@smoke'
  npm run test:any '@C45075-oaklawn'
  npm run test:any '@critical' '@positive'
```

### Detalles Técnicos

- **Script**: Script Node.js usando `child_process.spawn`
- **Cucumber**: Ejecuta cucumber-js con `--parallel 4`
- **Códigos de salida**: Preserva códigos de salida de cucumber para integración CI/CD
- **Directorio de trabajo**: Se ejecuta desde la raíz del proyecto automáticamente
