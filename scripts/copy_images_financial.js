const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/progr/Downloads/images-financial';
const destDir = path.join(__dirname, '..', 'public', 'assets', 'upload', 'news');

const mapping = [
  {
    src: 'Global Democratic Security Alliance Adopts Landmark Framework to Protect Electoral Infrastructure from Autonomous Cyber Threats.jpg',
    dest: 'news-democratic-security-alliance-electoral-defense-2026.webp'
  },
  {
    src: 'International Trade Commission Ratifies $140 Billion Clean Aviation Fuel and Sustainable Freight Logistics Corridor.jpg',
    dest: 'news-clean-aviation-fuel-freight-logistics-2026.webp'
  },
  {
    src: 'Transatlantic Quantum Telecommunications Consortium Activates Next-Generation Satellite-to-Ground Encryption Network.jpg',
    dest: 'news-quantum-satellite-telecom-encryption-network-2026.webp'
  },
  {
    src: 'Global Renewable Grid Coalition Unveils $95 Billion Intercontinental Supergrid Connecting Offshore Wind and Solar Corridors.jpg',
    dest: 'news-intercontinental-supergrid-offshore-wind-solar-2026.webp'
  }
];

mapping.forEach(item => {
  const sourcePath = path.join(srcDir, item.src);
  const targetPath = path.join(destDir, item.dest);

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    const stat = fs.statSync(targetPath);
    console.log(`Copied [${item.src.substring(0, 35)}...] -> ${item.dest} (${stat.size} bytes)`);
  } else {
    console.error(`Source not found: ${sourcePath}`);
  }
});
