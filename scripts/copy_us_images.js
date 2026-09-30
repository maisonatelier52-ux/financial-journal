const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/progr/Downloads/images-financial';
const destDir = path.join(__dirname, '..', 'public', 'assets', 'upload', 'news');

const mapping = [
  {
    src: 'U.S. Senate Passes Landmark Bipartisan Critical Minerals Independence and Domestic Refining Security Act.avif',
    dest: 'news-us-senate-critical-minerals-refining-act-2026.webp'
  },
  {
    src: 'Federal Reserve and Treasury Unveil Comprehensive Liquidity Modernization Framework for Non-Bank Financial Intermediaries.jpg',
    dest: 'news-fed-treasury-nonbank-liquidity-framework-2026.webp'
  },
  {
    src: 'U.S. Department of Commerce Expands National Semiconductor Foundry Hub with $45 Billion Sub-2nm Next-Gen Silicon Corridor.jpg',
    dest: 'news-us-sub2nm-semiconductor-foundry-corridor-2026.webp'
  },
  {
    src: 'U.S. Department of Energy Grants Final Approvals for $38 Billion Western Clean Hydrogen Pipeline and Carbon Capture Network.jpg',
    dest: 'news-us-doe-western-clean-hydrogen-pipeline-2026.webp'
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
