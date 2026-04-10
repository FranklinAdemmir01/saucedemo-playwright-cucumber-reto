# 🚀 Guía de Inicio Rápido

## Configuración Inicial

1. **Instalar Dependencias**
```bash
npm install
npx playwright install
```

2. **Configurar Ambiente**
```bash
# Copiar archivo de ambiente
cp .env.example .env

# Editar si es necesario (opcional)
```

3. **Ejecutar Tests**
```bash
# Ejecutar todos los tests
npm test

# Ejecutar con reporte
npm run test:report

# Ver reporte
# Abrir: reports/generated/index.html
```

## Comandos Comunes

```bash
# Desarrollo
npm run lint              # Verificar calidad de código
npm run format           # Formatear código
npm run clean            # Limpiar reportes

# Testing
npm test                 # Ejecutar todos los tests
npm run test:login      # Ejecutar tests de login
npm run test:cart       # Ejecutar tests de carrito
npm run test:checkout   # Ejecutar tests de checkout
npm run test:chrome     # Ejecutar en Chrome
npm run test:headed     # Ejecutar con navegador visible

# Reportes
npm run report          # Generar reporte HTML
```

## Ejecutar Escenarios Específicos

```bash
# Por tags
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "@critical"
npx cucumber-js --tags "@e2e"

# Por feature
npx cucumber-js features/login.feature
npx cucumber-js features/cart.feature
```

## Solución de Problemas

**¿Problemas con el navegador?**
```bash
npx playwright install --force
```

**¿Errores de TypeScript?**
```bash
npm run clean
npm install
```

**¿Tests con timeout?**
```bash
# Editar .env
TIMEOUT=60000
HEADLESS=false
```

## Próximos Pasos

1. Revisar [README.md](README.md) para documentación completa
2. Consultar [AUTOMATION_STRATEGY.md](AUTOMATION_STRATEGY.md) para patrones y estrategia
3. Explorar archivos de features en la carpeta `features/`
4. Revisar page objects en `src/pages/`

## Soporte

- Abrir un issue en GitHub
- Consultar documentación en README.md
- Revisar logs en `reports/logs/`

---

¡Felices Pruebas! 🎭✨
