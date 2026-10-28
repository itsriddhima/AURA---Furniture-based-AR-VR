const fs = require('fs');
const path = require('path');

console.log('--- AURA Verification Suite ---');

// 1. Check cutouts
const cutouts = ['soren-chair.png', 'alabaster-table.png', 'njord-sofa.png'];
for (const c of cutouts) {
  const p = path.join(process.cwd(), 'public', 'cutouts', c);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing cutout file: ${c}`);
  }
  const buf = fs.readFileSync(p);
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47) {
    throw new Error(`Invalid PNG signature for ${c}`);
  }
  console.log(`[PASS] Cutout ${c}: ${buf.length} bytes, valid PNG`);
}

// 2. Check product catalog file
const productsFile = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'products.js'), 'utf8');
if (!productsFile.includes('cutoutImage: "/cutouts/soren-chair.png"') ||
    !productsFile.includes('cutoutImage: "/cutouts/alabaster-table.png"') ||
    !productsFile.includes('cutoutImage: "/cutouts/njord-sofa.png"')) {
  throw new Error('Missing cutoutImage references in products.js');
}
console.log('[PASS] products.js has proper cutout references');

// 3. Check storage DB version & cutout caching
const storageFile = fs.readFileSync(path.join(process.cwd(), 'src', 'utils', 'storage.js'), 'utf8');
if (!storageFile.includes('DB_VERSION = 2') ||
    !storageFile.includes('getCachedCutout') ||
    !storageFile.includes('saveCachedCutout')) {
  throw new Error('storage.js missing DB_VERSION 2 or cutout cache functions');
}
console.log('[PASS] storage.js has IndexedDB cutout_cache store and methods');

// 4. Check RoomCanvas for shadow and cutout integration
const canvasFile = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'room-editor', 'RoomCanvas.jsx'), 'utf8');
if (!canvasFile.includes('shadowIntensity') ||
    !canvasFile.includes('radial-gradient') ||
    !canvasFile.includes('displayImageSrc') ||
    !canvasFile.includes('brightness(')) {
  throw new Error('RoomCanvas.jsx missing contact shadow or lighting filter integration');
}
console.log('[PASS] RoomCanvas.jsx has contact shadow and lighting filters');

// 5. Check ObjectInspector for lighting and cutout controls
const inspectorFile = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'room-editor', 'ObjectInspector.jsx'), 'utf8');
if (!inspectorFile.includes('removeBackground') ||
    !inspectorFile.includes('Contact Shadow') ||
    !inspectorFile.includes('Atmospheric Warmth') ||
    !inspectorFile.includes('handleLightingChange')) {
  throw new Error('ObjectInspector.jsx missing lighting or background removal controls');
}
console.log('[PASS] ObjectInspector.jsx has lighting, shadow, and background removal controls');

// 6. Check Hero.jsx for simplified typography & buttons
const heroFile = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'Hero.jsx'), 'utf8');
if (!heroFile.includes('Open Room Planner') || !heroFile.includes('Browse Furniture')) {
  throw new Error('Hero.jsx missing simplified CTA buttons');
}
console.log('[PASS] Hero.jsx is simplified with practical CTAs');

console.log('--- ALL CHECKS PASSED SUCCESSFULLY ---');
