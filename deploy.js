import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if .env file exists
console.log('Checking deployment readiness...');

// Load environment variables
dotenv.config();

// Required environment variables
const requiredEnvVars = [
  'PORT',
  'NODE_ENV',
  'MONGO_URI',
  'JWT_SECRET'
];

// Check for required env vars
console.log('\nChecking environment variables:');
let missingEnvVars = [];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    missingEnvVars.push(envVar);
    console.log(`❌ ${envVar} is missing`);
  } else {
    console.log(`✅ ${envVar} is set`);
  }
});

// Check for required directories
console.log('\nChecking required directories:');
const requiredDirs = ['uploads'];

requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`❌ ${dir} directory is missing, creating it now`);
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ ${dir} directory created`);
  } else {
    console.log(`✅ ${dir} directory exists`);
  }
});

// Check for Node.js version
console.log('\nChecking Node.js version:');
const nodeVersion = process.version;
const requiredNodeVersion = '18.0.0';

const currentVersion = nodeVersion.replace('v', '').split('.');
const requiredVersion = requiredNodeVersion.split('.');

let isNodeVersionCompatible = true;
for (let i = 0; i < 3; i++) {
  if (parseInt(currentVersion[i] || 0) < parseInt(requiredVersion[i] || 0)) {
    isNodeVersionCompatible = false;
    break;
  } else if (parseInt(currentVersion[i] || 0) > parseInt(requiredVersion[i] || 0)) {
    break;
  }
}

if (isNodeVersionCompatible) {
  console.log(`✅ Node.js ${nodeVersion} meets the requirement (>= ${requiredNodeVersion})`);
} else {
  console.log(`❌ Node.js ${nodeVersion} does not meet the requirement (>= ${requiredNodeVersion})`);
  console.log('   Please update your Node.js version before deploying.');
}

// Summary
console.log('\nDeployment Readiness Summary:');
if (missingEnvVars.length > 0) {
  console.log(`❌ Missing ${missingEnvVars.length} environment variables. Please set them before deploying.`);
} else {
  console.log('✅ All required environment variables are set.');
}

if (!isNodeVersionCompatible) {
  console.log('❌ Node.js version requirement not met.');
} else {
  console.log('✅ Node.js version requirement met.');
}

// Final assessment
const isReadyToDeploy = missingEnvVars.length === 0 && isNodeVersionCompatible;

console.log('\n' + (isReadyToDeploy 
  ? '✅ Your application is ready to deploy!' 
  : '❌ Your application is NOT ready to deploy. Please fix the issues above.'));

if (isReadyToDeploy) {
  console.log('\nYou can now deploy your application with:');
  console.log('   1. Run: npm start');
  console.log('   2. Or deploy to your hosting provider.');
}

process.exit(isReadyToDeploy ? 0 : 1); 