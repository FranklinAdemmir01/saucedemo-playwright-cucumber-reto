# 🎭 SauceDemo - Playwright + Cucumber Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=flat&logo=playwright&logoColor=white)
![Cucumber](https://img.shields.io/badge/Cucumber-23D96C?style=flat&logo=cucumber&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)

Framework de pruebas E2E de nivel empresarial para la aplicación SauceDemo utilizando Playwright, Cucumber BDD y TypeScript con patrón Page Object Model.

---

## 📑 Tabla de Contenidos

- [Inicio Rápido](#-inicio-rápido)
- [Características](#-características)
- [Estructura del Proyecto](#️-estructura-del-proyecto)
- [Ejecutar Tests](#-ejecutar-tests)
- [Configuración de Ambientes](#-configuración-de-ambientes)
- [Reportes de Tests](#-reportes-de-tests)
- [Configuración de Navegador](#️-configuración-de-navegador)
- [Tecnologías Clave](#-tecnologías-clave)
- [Documentación](#-documentación)
- [Desarrollo](#-desarrollo)
- [Cobertura de Tests](#-cobertura-de-tests)
- [Arquitectura y Diseño](#️-arquitectura-y-diseño)
- [Contribuir](#-contribuir)

---

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install
npx playwright install

# Ejecutar tests
npm test

# Generar reporte HTML
npm run test:report
```

📊 **Reporte:** `reports/generated/index.html`

---

## ✨ Características

- ✅ **BDD con Gherkin** - Escenarios legibles para el negocio
- ✅ **Page Object Model** - Arquitectura mantenible
- ✅ **Ejecución Paralela** - Tests rápidos (4 workers)
- ✅ **Multi-navegador** - Chromium, Firefox, WebKit
- ✅ **Multi-ambiente** - Configuraciones dev, qa, prod
- ✅ **Reportes HTML** - Reportes profesionales con videos
- ✅ **TypeScript** - Código con tipos seguros e IntelliSense
- ✅ **Screenshots Automáticos** - Captura de evidencia en fallos

---

## 🏗️ Estructura del Proyecto

```
📦 saucedemo-playwright-cucumber
├── 📂 src/
│   ├── config/         # Configuraciones de ambiente y tests
│   ├── features/       # Archivos de features en Gherkin
│   ├── hooks/          # Hooks de Cucumber (Before/After)
│   ├── pages/          # Clases Page Object Model
│   ├── steps/          # Definiciones de steps (glue code)
│   ├── support/        # World y contexto de tests
│   └── utils/          # Utilidades (logger, screenshots)
├── 📂 scripts/         # Scripts de utilidad
├── 📂 docs/            # Documentación
├── 📂 reports/         # Reportes y artefactos de tests
└── 📄 cucumber.js      # Configuración de Cucumber
```

---

## 🧪 Ejecutar Tests

### Todos los Tests
```bash
npm test                     # Ejecutar todos los tests
npm run test:report          # Ejecutar + generar reporte HTML
```

### Por Feature
```bash
npm run test:login          # Tests de login
npm run test:cart           # Tests de carrito
npm run test:checkout       # Tests de checkout
```

### Por Tags
```bash
npm run test:smoke          # Tests de smoke
npm run test:critical       # Tests críticos
npm run test:any "@tag"     # Tag personalizado
```

### Específico por Ambiente
```bash
ENV=dev npm test            # Desarrollo (default)
ENV=qa npm test             # Ambiente QA
ENV=prod npm test           # Producción

# O usar atajos
npm run env:dev && npm test
npm run env:qa && npm test
npm run env:prod && npm test
```

---

## 🌍 Configuración de Ambientes

Tres ambientes preconfigurados:

| Ambiente    | Workers | Reintentos | Headless | Videos | Caso de Uso |
|-------------|---------|------------|----------|--------|-------------|
| **dev**     | 4       | 2          | ❌       | ✅     | Desarrollo local |
| **qa**      | 4       | 2          | ✅       | ✅     | Pipeline CI/CD |
| **prod**    | 2       | 0          | ✅       | ❌     | Smoke tests de producción |

**Cambiar ambiente:**
```bash
npm run env:qa              # Cambiar a QA
npm run env                 # Mostrar ambiente actual
```

Ver [docs/CAMBIAR_AMBIENTE.md](docs/CAMBIAR_AMBIENTE.md) para guía detallada.

---

## 📊 Reportes de Tests

### Generar Reporte
```bash
npm run report              # Generar desde última ejecución
npm run test:report         # Ejecutar tests + generar reporte
```

El reporte HTML incluye:
- ✅ Resumen de ejecución con estadísticas pass/fail
- 📊 Gráficos y visualizaciones
- 📹 Videos embebidos (en fallos)
- 📸 Screenshots (en fallos)
- ⏱️ Duración de ejecución por escenario
- 🌍 Detalles del ambiente

---

## 🛠️ Configuración de Navegador

```bash
# Ejecutar con diferentes navegadores
BROWSER=chromium npm test   # Default
BROWSER=firefox npm test
BROWSER=webkit npm test

# Modo headless
HEADLESS=true npm test      # Headless (CI/CD)
HEADLESS=false npm test     # Con ventana (debugging)
```

---

## 🧩 Tecnologías Clave

- **Playwright v1.42+** - Automatización de navegadores
- **Cucumber v10.3+** - Framework de testing BDD
- **TypeScript v5.3+** - Desarrollo con tipos seguros
- **Winston** - Logging estructurado
- **Multiple Cucumber HTML Reporter** - Reportes profesionales
- **Page Object Model** - Patrón de diseño para mantenibilidad

---

## 📚 Documentación

- [📖 Guía de Inicio Rápido](QUICKSTART.md)
- [📊 Estrategia de Automatización](AUTOMATION_STRATEGY.md)
- [🌍 Configuración de Ambientes](docs/CAMBIAR_AMBIENTE.md)
- [⚙️ Configuración de Tests](docs/TEST_CONFIG.md)
- [🏗️ Setup de Ambientes](docs/ENVIRONMENT_CONFIG.md)
- [📝 Resumen del Proyecto](docs/PROJECT_SUMMARY.md)

---

## 🔧 Desarrollo

### Prerequisitos
- Node.js 18+
- npm 9+
- Git

### Instalar Dependencias
```bash
npm install
npx playwright install
```

### Ejecutar Linting
```bash
npm run lint               # Verificar calidad de código
npm run format             # Formatear código con Prettier
```

### Limpiar Reportes
```bash
npm run clean              # Eliminar todos los reportes
```

---

## 🎯 Cobertura de Tests

**Escenarios:** 5 archivos de features cubriendo:
- 🔐 Autenticación (login, logout, manejo de errores)
- 🛒 Carrito de Compras (agregar, ver, eliminar items)
- 💳 Checkout (flujo completo de compra, validación)
- 📦 Inventario (navegación de productos, ordenamiento)

**Tags para Organización:**
- `@smoke` - Flujos críticos happy path
- `@critical` - Escenarios de alta prioridad
- `@positive` - Flujos exitosos
- `@negative` - Manejo de errores
- `@e2e` - Flujos end-to-end

---

## 🏛️ Arquitectura y Diseño

Este framework implementa **principios SOLID** y arquitectura limpia:

- **Responsabilidad Única** - Cada clase tiene un propósito
- **Abierto/Cerrado** - Extensible sin modificación
- **Sustitución de Liskov** - Page objects polimórficos
- **Segregación de Interfaces** - Interfaces enfocadas
- **Inversión de Dependencias** - Depender de abstracciones

**Patrones de Diseño:**
- Page Object Model (POM)
- Singleton (Config, Logger)
- Factory (Creación de navegadores)
- Template Method (Página base)

Ver [AUTOMATION_STRATEGY.md](AUTOMATION_STRATEGY.md) para detalles.

---

## 📄 Licencia

MIT License - Ver archivo LICENSE para detalles.

---

## 👤 Autor

**SDET Senior Team**  
Enterprise Test Automation Framework

---

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama de feature (`git checkout -b feature/amazing-feature`)
3. Commit de cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

---

**⭐ Dale estrella a este repo si te resulta útil!**
