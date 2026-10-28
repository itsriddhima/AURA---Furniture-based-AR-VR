const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const outDir = path.join(process.cwd(), 'public', 'cutouts');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function makeCrcTable() {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  return table;
}
const crcTable = makeCrcTable();
function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function writeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  buf.writeUInt32BE(crc32(typeAndData), 8 + len);
  return buf;
}

function encodePng(width, height, rgbaBuffer) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = writeChunk('IHDR', ihdrData);

  const rawScanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    rawScanlines[rowOffset] = 0;
    rgbaBuffer.copy(rawScanlines, rowOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const deflated = zlib.deflateSync(rawScanlines, { level: 9 });
  const idatChunk = writeChunk('IDAT', deflated);
  const iendChunk = writeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// Alpha blend pixel (r, g, b, a) into RGBA buffer at (x, y)
function blendPixel(buf, w, h, x, y, r, g, b, a) {
  if (x < 0 || x >= w || y < 0 || y >= h || a <= 0) return;
  const idx = (y * w + x) * 4;
  const srcA = Math.min(255, Math.max(0, a)) / 255;
  const dstA = buf[idx + 3] / 255;

  const outA = srcA + dstA * (1 - srcA);
  if (outA <= 0) return;

  const outR = Math.round((r * srcA + buf[idx] * dstA * (1 - srcA)) / outA);
  const outG = Math.round((g * srcA + buf[idx + 1] * dstA * (1 - srcA)) / outA);
  const outB = Math.round((b * srcA + buf[idx + 2] * dstA * (1 - srcA)) / outA);

  buf[idx] = outR;
  buf[idx + 1] = outG;
  buf[idx + 2] = outB;
  buf[idx + 3] = Math.round(outA * 255);
}

// Draw anti-aliased filled rounded rectangle or ellipse with gradient & texture
function drawChair(w, h) {
  const buf = Buffer.alloc(w * h * 4, 0); // start with transparent black

  // 1. Tapered Wooden Legs (Solid Oak)
  // Front-left, front-right, rear-left, rear-right
  const legs = [
    { x1: 170, y1: 430, x2: 155, y2: 560, wTop: 22, wBot: 14, shade: 0.95 },
    { x1: 225, y1: 430, x2: 215, y2: 550, wTop: 18, wBot: 12, shade: 0.75 }, // rear shadow
    { x1: 375, y1: 430, x2: 385, y2: 550, wTop: 18, wBot: 12, shade: 0.75 }, // rear shadow
    { x1: 430, y1: 430, x2: 445, y2: 560, wTop: 22, wBot: 14, shade: 0.95 },
  ];

  for (const leg of legs) {
    for (let y = leg.y1; y <= leg.y2; y++) {
      const t = (y - leg.y1) / (leg.y2 - leg.y1);
      const cx = leg.x1 + (leg.x2 - leg.x1) * t;
      const curW = (leg.wTop * (1 - t) + leg.wBot * t) / 2;
      for (let x = Math.floor(cx - curW - 2); x <= Math.ceil(cx + curW + 2); x++) {
        const dist = Math.abs(x - cx);
        let alpha = 255;
        if (dist > curW) {
          alpha = Math.max(0, Math.min(255, (1 - (dist - curW)) * 255));
        }
        if (alpha > 0) {
          const woodT = (x - (cx - curW)) / (curW * 2);
          const woodR = Math.round((140 + woodT * 35 - t * 25) * leg.shade);
          const woodG = Math.round((105 + woodT * 28 - t * 20) * leg.shade);
          const woodB = Math.round((70 + woodT * 20 - t * 15) * leg.shade);
          blendPixel(buf, w, h, x, y, woodR, woodG, woodB, alpha);
        }
      }
    }
  }

  // 2. Thick Oatmeal Bouclé Seat Cushion
  // Bounded around cx: 300, cy: 380, rx: 175, ry: 65
  for (let y = 300; y <= 450; y++) {
    for (let x = 110; x <= 490; x++) {
      const dx = (x - 300) / 165;
      const dy = (y - 380) / 60;
      const d = dx * dx + dy * dy;
      if (d <= 1.05) {
        let alpha = 255;
        if (d > 0.96) {
          alpha = Math.max(0, Math.min(255, (1.05 - d) / 0.09 * 255));
        }
        // Subtle textural variation + top light
        const grain = ((Math.sin(x * 0.4) * Math.cos(y * 0.4) + Math.sin(x * 0.15 + y * 0.2)) * 0.5 + 0.5);
        const light = 1 - (y - 320) / 240 + (1 - Math.abs(dx)) * 0.15;
        const r = Math.round(Math.min(255, (222 + grain * 8) * light));
        const g = Math.round(Math.min(255, (216 + grain * 8) * light));
        const b = Math.round(Math.min(255, (206 + grain * 8) * light));
        blendPixel(buf, w, h, x, y, r, g, b, alpha);
      }
    }
  }

  // 3. Bouclé Backrest & Pillow
  // Curved vertical pill shape: cx: 300, cy: 230, rx: 140, ry: 130
  for (let y = 80; y <= 370; y++) {
    for (let x = 140; x <= 460; x++) {
      // Shape slightly wider at top shoulders
      const yNorm = (y - 230) / 140;
      const widthFactor = 1 - yNorm * 0.18;
      const dx = (x - 300) / (135 * widthFactor);
      const dy = yNorm;
      const d = dx * dx + dy * dy;
      if (d <= 1.04) {
        let alpha = 255;
        if (d > 0.95) {
          alpha = Math.max(0, Math.min(255, (1.04 - d) / 0.09 * 255));
        }
        const grain = ((Math.sin(x * 0.35) * Math.cos(y * 0.35) + Math.sin(x * 0.8)) * 0.5 + 0.5);
        const depth = 1 - (dx * dx * 0.35) - (y - 100) / 500;
        const r = Math.round(Math.min(255, (228 + grain * 7) * depth));
        const g = Math.round(Math.min(255, (222 + grain * 7) * depth));
        const b = Math.round(Math.min(255, (212 + grain * 7) * depth));
        blendPixel(buf, w, h, x, y, r, g, b, alpha);
      }
    }
  }

  // 4. Curved Organic Solid Oak Armrests
  // Left arm (x: 120..180, y: 220..420), Right arm (x: 420..480, y: 220..420)
  const arms = [
    { cx: 145, cy: 310, rx: 20, ry: 90, tilt: -0.15 },
    { cx: 455, cy: 310, rx: 20, ry: 90, tilt: 0.15 },
  ];

  for (const arm of arms) {
    for (let y = arm.cy - 100; y <= arm.cy + 100; y++) {
      for (let x = arm.cx - 35; x <= arm.cx + 35; x++) {
        const ny = (y - arm.cy) / arm.ry;
        const nx = (x - (arm.cx + ny * arm.tilt * 30)) / arm.rx;
        const d = nx * nx + ny * ny;
        if (d <= 1.05) {
          let alpha = 255;
          if (d > 0.94) {
            alpha = Math.max(0, Math.min(255, (1.05 - d) / 0.11 * 255));
          }
          const woodGrain = Math.sin(y * 0.25) * 8;
          const light = 1 - (nx * 0.3) + (ny * 0.1);
          const r = Math.round(Math.min(255, (155 + woodGrain) * light));
          const g = Math.round(Math.min(255, (115 + woodGrain * 0.8) * light));
          const b = Math.round(Math.min(255, (75 + woodGrain * 0.5) * light));
          blendPixel(buf, w, h, x, y, r, g, b, alpha);
        }
      }
    }
  }

  return encodePng(w, h, buf);
}

// Alabaster Fluted Plinth Table Cutout
function drawTable(w, h) {
  const buf = Buffer.alloc(w * h * 4, 0);

  // 1. Dual Monolithic Fluted Plinths (Columns)
  // Left plinth: cx: 270, Right plinth: cx: 530
  const plinths = [270, 530];
  for (const pcx of plinths) {
    for (let y = 190; y <= 380; y++) {
      for (let x = pcx - 90; x <= pcx + 90; x++) {
        const dx = (x - pcx) / 85;
        if (Math.abs(dx) <= 1.02) {
          let alpha = 255;
          if (Math.abs(dx) > 0.95) {
            alpha = Math.max(0, Math.min(255, (1.02 - Math.abs(dx)) / 0.07 * 255));
          }
          // Fluted ridges simulation
          const flute = Math.cos((x - pcx) * 0.22);
          const curvature = Math.sqrt(Math.max(0, 1 - dx * dx));
          const stoneShade = 0.82 + curvature * 0.25 + flute * 0.14;
          const pore = (Math.sin(x * 0.3) * Math.cos(y * 0.2) > 0.85) ? -18 : 0;
          const r = Math.round(Math.min(255, Math.max(0, (225 + pore) * stoneShade)));
          const g = Math.round(Math.min(255, Math.max(0, (218 + pore) * stoneShade)));
          const b = Math.round(Math.min(255, Math.max(0, (206 + pore) * stoneShade)));
          blendPixel(buf, w, h, x, y, r, g, b, alpha);
        }
      }
    }
  }

  // 2. Thick Monolithic Roman Travertine Top Oval Slab
  // cx: 400, cy: 175, rx: 360, ry: 75
  // Top surface
  for (let y = 90; y <= 220; y++) {
    for (let x = 30; x <= 770; x++) {
      const dx = (x - 400) / 360;
      const dy = (y - 165) / 65;
      const d = dx * dx + dy * dy;
      if (d <= 1.03) {
        let alpha = 255;
        if (d > 0.96) {
          alpha = Math.max(0, Math.min(255, (1.03 - d) / 0.07 * 255));
        }
        // Travertine veining & gentle honing highlights
        const vein = Math.sin(dx * 8 + dy * 4) * 6 + Math.cos(dx * 14) * 4;
        const bevel = y > 180 ? 0.88 : (1 + (1 - dy) * 0.12);
        const r = Math.round(Math.min(255, Math.max(0, (235 + vein) * bevel)));
        const g = Math.round(Math.min(255, Math.max(0, (229 + vein) * bevel)));
        const b = Math.round(Math.min(255, Math.max(0, (218 + vein) * bevel)));
        blendPixel(buf, w, h, x, y, r, g, b, alpha);
      }
    }
  }

  // 3. Beveled rim drop
  for (let y = 175; y <= 205; y++) {
    for (let x = 45; x <= 755; x++) {
      const dx = (x - 400) / 355;
      const dy = (y - 180) / 22;
      const d = dx * dx + dy * dy;
      if (d <= 1.02 && y > 175) {
        const rimA = Math.max(0, Math.min(220, (1.02 - d) * 400));
        blendPixel(buf, w, h, x, y, 195, 188, 175, rimA);
      }
    }
  }

  return encodePng(w, h, buf);
}

// Njord Three-Seat Tailored Belgian Linen Sofa Cutout
function drawSofa(w, h) {
  const buf = Buffer.alloc(w * h * 4, 0);

  // 1. Recessed Base Plinth (Dark Oak)
  for (let y = 370; y <= 415; y++) {
    for (let x = 80; x <= 820; x++) {
      const dx = (x - 450) / 370;
      if (Math.abs(dx) <= 1.0) {
        const t = (y - 370) / 45;
        const r = Math.round(75 - t * 20);
        const g = Math.round(60 - t * 15);
        const b = Math.round(48 - t * 12);
        blendPixel(buf, w, h, x, y, r, g, b, 255);
      }
    }
  }

  // 2. Main Sofa Base & Seat Structure
  for (let y = 260; y <= 385; y++) {
    for (let x = 50; x <= 850; x++) {
      const dx = (x - 450) / 395;
      const dy = (y - 325) / 58;
      const d = Math.pow(Math.abs(dx), 3.2) + Math.pow(Math.abs(dy), 2.2);
      if (d <= 1.04) {
        let alpha = 255;
        if (d > 0.94) {
          alpha = Math.max(0, Math.min(255, (1.04 - d) / 0.1 * 255));
        }
        const grain = Math.sin(x * 0.2) * 5;
        const shade = 1 - (y - 260) / 280;
        const r = Math.round((218 + grain) * shade);
        const g = Math.round((212 + grain) * shade);
        const b = Math.round((202 + grain) * shade);
        blendPixel(buf, w, h, x, y, r, g, b, alpha);
      }
    }
  }

  // 3. Three Plush Seat Cushions
  const cushionCenters = [200, 450, 700];
  for (const cx of cushionCenters) {
    for (let y = 265; y <= 355; y++) {
      for (let x = cx - 118; x <= cx + 118; x++) {
        const dx = (x - cx) / 115;
        const dy = (y - 310) / 42;
        const d = Math.pow(Math.abs(dx), 2.4) + Math.pow(Math.abs(dy), 2.2);
        if (d <= 1.03) {
          let alpha = 255;
          if (d > 0.93) {
            alpha = Math.max(0, Math.min(255, (1.03 - d) / 0.1 * 255));
          }
          // Cushion crease & highlight
          const crease = Math.sin(dy * 3.14) * 0.12;
          const light = 1.05 - Math.abs(dx) * 0.1 + crease;
          const r = Math.round(Math.min(255, 226 * light));
          const g = Math.round(Math.min(255, 220 * light));
          const b = Math.round(Math.min(255, 210 * light));
          blendPixel(buf, w, h, x, y, r, g, b, alpha);
        }
      }
    }
  }

  // 4. Three Back Pillows / Cushions
  for (const cx of cushionCenters) {
    for (let y = 120; y <= 275; y++) {
      for (let x = cx - 115; x <= cx + 115; x++) {
        const dx = (x - cx) / 112;
        const dy = (y - 200) / 75;
        const d = Math.pow(Math.abs(dx), 2.3) + Math.pow(Math.abs(dy), 2.2);
        if (d <= 1.04) {
          let alpha = 255;
          if (d > 0.94) {
            alpha = Math.max(0, Math.min(255, (1.04 - d) / 0.1 * 255));
          }
          const pillowShade = 1.08 - (y - 120) / 250 - Math.abs(dx) * 0.12;
          const r = Math.round(Math.min(255, 230 * pillowShade));
          const g = Math.round(Math.min(255, 224 * pillowShade));
          const b = Math.round(Math.min(255, 214 * pillowShade));
          blendPixel(buf, w, h, x, y, r, g, b, alpha);
        }
      }
    }
  }

  // 5. Tailored Side Armrests (Left & Right)
  const armrests = [
    { cx: 78, cy: 260, rx: 34, ry: 85 },
    { cx: 822, cy: 260, rx: 34, ry: 85 }
  ];
  for (const arm of armrests) {
    for (let y = arm.cy - arm.ry; y <= arm.cy + arm.ry; y++) {
      for (let x = arm.cx - arm.rx; x <= arm.cx + arm.rx; x++) {
        const dx = (x - arm.cx) / arm.rx;
        const dy = (y - arm.cy) / arm.ry;
        const d = Math.pow(Math.abs(dx), 2.2) + Math.pow(Math.abs(dy), 2.2);
        if (d <= 1.03) {
          let alpha = 255;
          if (d > 0.92) {
            alpha = Math.max(0, Math.min(255, (1.03 - d) / 0.11 * 255));
          }
          const armShade = 1.06 - (y - (arm.cy - arm.ry)) / 200 - Math.abs(dx) * 0.1;
          const r = Math.round(Math.min(255, 224 * armShade));
          const g = Math.round(Math.min(255, 218 * armShade));
          const b = Math.round(Math.min(255, 208 * armShade));
          blendPixel(buf, w, h, x, y, r, g, b, alpha);
        }
      }
    }
  }

  return encodePng(w, h, buf);
}

// Generate files
const chairPng = drawChair(600, 600);
fs.writeFileSync(path.join(outDir, 'soren-chair.png'), chairPng);
console.log('Generated public/cutouts/soren-chair.png, bytes:', chairPng.length);

const tablePng = drawTable(800, 450);
fs.writeFileSync(path.join(outDir, 'alabaster-table.png'), tablePng);
console.log('Generated public/cutouts/alabaster-table.png, bytes:', tablePng.length);

const sofaPng = drawSofa(900, 480);
fs.writeFileSync(path.join(outDir, 'njord-sofa.png'), sofaPng);
console.log('Generated public/cutouts/njord-sofa.png, bytes:', sofaPng.length);
