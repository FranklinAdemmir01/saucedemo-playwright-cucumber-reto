#!/usr/bin/env node

/**
 * Script de ayuda para cambiar el ambiente en el archivo .env
 * 
 * Uso:
 *   node scripts/set-environment.js dev
 *   node scripts/set-environment.js qa
 *   node scripts/set-environment.js prod
 *   node scripts/set-environment.js          (muestra ambiente actual)
 */

const fs = require('fs');
const path = require('path');

const VALID_ENVIRONMENTS = ['dev', 'qa', 'prod'];
const ENV_FILE = path.join(__dirname, '..', '.env');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function showCurrentEnvironment() {
  if (!fs.existsSync(ENV_FILE)) {
    console.log(`${colors.red}❌ Archivo .env no encontrado${colors.reset}`);
    console.log(`   Copia .env.example a .env primero`);
    process.exit(1);
  }

  const content = fs.readFileSync(ENV_FILE, 'utf-8');
  const match = content.match(/^ENV=(.+)$/m);
  
  if (match) {
    const currentEnv = match[1].trim();
    console.log(`\n${colors.bright}🌍 Ambiente actual:${colors.reset} ${colors.green}${currentEnv}${colors.reset}\n`);
    showEnvironmentDetails(currentEnv);
  } else {
    console.log(`${colors.yellow}⚠️  Variable ENV no encontrada en .env${colors.reset}`);
    console.log(`   Agrega: ENV=dev`);
  }
}

function showEnvironmentDetails(env) {
  const details = {
    dev: {
      workers: '4',
      retries: '2',
      headless: 'No',
      videos: 'Sí',
      timeout: '30s/10s/60s',
      description: 'Desarrollo local con debugging'
    },
    qa: {
      workers: '4',
      retries: '2',
      headless: 'Sí',
      videos: 'Sí',
      timeout: '30s/10s/60s',
      description: 'Testing en QA/CI-CD'
    },
    prod: {
      workers: '2',
      retries: '0',
      headless: 'Sí',
      videos: 'No',
      timeout: '20s/5s/40s',
      description: 'Smoke tests en producción'
    }
  };

  const detail = details[env];
  if (detail) {
    console.log(`   ${colors.blue}Descripción:${colors.reset} ${detail.description}`);
    console.log(`   ${colors.blue}Workers:${colors.reset}     ${detail.workers} paralelos`);
    console.log(`   ${colors.blue}Retries:${colors.reset}     ${detail.retries} intentos`);
    console.log(`   ${colors.blue}Headless:${colors.reset}    ${detail.headless}`);
    console.log(`   ${colors.blue}Videos:${colors.reset}      ${detail.videos}`);
    console.log(`   ${colors.blue}Timeouts:${colors.reset}    ${detail.timeout} (default/short/long)`);
  }
}

function setEnvironment(newEnv) {
  if (!VALID_ENVIRONMENTS.includes(newEnv)) {
    console.log(`${colors.red}❌ Ambiente inválido: ${newEnv}${colors.reset}`);
    console.log(`   Ambientes válidos: ${VALID_ENVIRONMENTS.join(', ')}`);
    process.exit(1);
  }

  if (!fs.existsSync(ENV_FILE)) {
    console.log(`${colors.red}❌ Archivo .env no encontrado${colors.reset}`);
    console.log(`   Copia .env.example a .env primero`);
    process.exit(1);
  }

  let content = fs.readFileSync(ENV_FILE, 'utf-8');
  
  // Reemplazar la línea ENV=...
  if (content.match(/^ENV=.+$/m)) {
    content = content.replace(/^ENV=.+$/m, `ENV=${newEnv}`);
  } else {
    // Si no existe, agregar al inicio
    content = `ENV=${newEnv}\n\n${content}`;
  }

  fs.writeFileSync(ENV_FILE, content, 'utf-8');
  
  console.log(`\n${colors.green}✅ Ambiente cambiado exitosamente${colors.reset}\n`);
  showEnvironmentDetails(newEnv);
  
  console.log(`\n${colors.bright}💡 Ejecuta tus tests:${colors.reset}`);
  console.log(`   npm test`);
  console.log(`   npm run test:smoke`);
  console.log(`   npm run test:any '@tag'`);
  console.log('');
}

function showHelp() {
  console.log(`
${colors.bright}🌍 Script para cambiar el ambiente de testing${colors.reset}

${colors.bright}Uso:${colors.reset}
  node scripts/set-environment.js [ambiente]

${colors.bright}Ambientes disponibles:${colors.reset}
  ${colors.green}dev${colors.reset}   - Desarrollo (4 workers, videos ON, headless OFF)
  ${colors.green}qa${colors.reset}    - QA/Testing (4 workers, videos ON, headless ON)
  ${colors.green}prod${colors.reset}  - Producción (2 workers, videos OFF, headless ON)

${colors.bright}Ejemplos:${colors.reset}
  node scripts/set-environment.js dev     # Cambiar a desarrollo
  node scripts/set-environment.js qa      # Cambiar a QA
  node scripts/set-environment.js prod    # Cambiar a producción
  node scripts/set-environment.js         # Ver ambiente actual

${colors.bright}Nota:${colors.reset}
  Los cambios se aplican al archivo .env y persisten entre ejecuciones.
  Para cambios temporales, usa variables de entorno:
    $env:ENV='qa'; npm test    (PowerShell)
    ENV=qa npm test            (Linux/Mac)
`);
}

// Main
const args = process.argv.slice(2);

if (args.length === 0) {
  showCurrentEnvironment();
} else if (args[0] === '--help' || args[0] === '-h') {
  showHelp();
} else {
  setEnvironment(args[0]);
}
