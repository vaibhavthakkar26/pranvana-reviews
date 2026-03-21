const fs = require('fs');
const path = require('path');

const apiPath = 'd:\\2026\\Pranvana\\pranvana-reviews\\api';

if (fs.existsSync(apiPath)) {
  console.log(`Removing ${apiPath}...`);
  fs.rmSync(apiPath, { recursive: true, force: true });
  console.log('Done.');
} else {
  console.log('Path does not exist.');
}
