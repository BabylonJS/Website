const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

// Same mapping as process-images.js
const imageMap = {
  'clusteredLights': 'clusteredLighting',
  'texturedAreaLights': 'texturedAreaLights',
  'NPE': 'nodeParticleEditor',
  'particleFMAT': 'particleFlowMaps',
  'volumetricLighting': 'volumetricLighting',
  'frameGraph': 'frameGraph',
  'animationRetargeting': 'animationRetargeting',
  'GaussianSplat': 'gaussianSplat',
  'editor': 'babylonEditor',
  'inspectorV2': 'inspectorV2',
  'viewer': 'viewerUpdates',
  'playground': 'playgroundUpdates',
  'largeWorld': 'largeWorldRendering',
  'geoSpatialCamera': 'geospatialCamera',
  '3DTiles': '3dTiles',
  'atmospheric': 'physicallyBasedAtmosphere',
  'openPBR': 'openPBR',
  'IBLShadows': 'dynamicIBLShadows',
  'sdf': 'sdfText',
  'outlineRenderer': 'outlineRenderer',
  'navMesh': 'navMesh',
  'audio': 'audioEngine',
  '3mf': '3mfExporter'
};

const sourceDir = './.github/raw_images';
const destDir = './src/assets/img';

async function getEdgeColor(imagePath) {
  const image = sharp(imagePath);
  const metadata = await image.metadata();

  const edgeStrip = await image
    .extract({
      left: metadata.width - 1,
      top: Math.floor(metadata.height / 2),
      width: 1,
      height: 1
    })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data } = edgeStrip;
  const r = data[0];
  const g = data[1];
  const b = data[2];

  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

async function updateImage(baseName) {
  // Find the mapping entry (case-insensitive match on base name)
  const matchedKey = Object.keys(imageMap).find(
    k => k.toLowerCase() === baseName.toLowerCase()
  );

  if (!matchedKey) {
    console.error(`✗ Unknown image name: "${baseName}"`);
    console.error('\nAvailable names:');
    Object.keys(imageMap).forEach(k => console.error(`  ${k}`));
    process.exit(1);
  }

  const destName = imageMap[matchedKey];
  const updatedFile = path.join(sourceDir, `${matchedKey}_updated.png`);
  const destFile = path.join(destDir, `${destName}.png`);

  if (!await fs.pathExists(updatedFile)) {
    console.error(`✗ Updated image not found: ${updatedFile}`);
    console.error(`  Place your updated image at: .github/raw_images/${matchedKey}_updated.png`);
    process.exit(1);
  }

  console.log(`Processing ${matchedKey}_updated.png -> ${destName}.png ...\n`);

  // Sample edge color
  const bgColor = await getEdgeColor(updatedFile);

  // Resize and optimize
  await sharp(updatedFile)
    .resize(550, null, { withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 80 })
    .toFile(destFile);

  const stats = await fs.stat(destFile);
  const sizeKB = (stats.size / 1024).toFixed(2);

  // IMPORTANT: Never delete or replace files in raw_images/.
  // The _updated file and the original are both preserved as a record.

  // Update image-colors.json
  const colorsFile = './.github/image-colors.json';
  let colorMap = {};
  if (await fs.pathExists(colorsFile)) {
    colorMap = await fs.readJSON(colorsFile);
  }
  colorMap[`${destName}.png`] = bgColor;
  await fs.writeJSON(colorsFile, colorMap, { spaces: 2 });

  console.log(`✓ ${destName}.png updated (${sizeKB} KB)`);
  console.log(`✓ Background color: ${bgColor}`);
  console.log(`✓ image-colors.json updated`);
  console.log(`✓ Original and _updated images preserved in raw_images/`);
  console.log(`\nUpdate config.json background for "${destName}" to: ${bgColor}`);
}

// Get image name from command line args
const imageName = process.argv[2];

if (!imageName) {
  console.error('Usage: node .github/scripts/update-image.js <imageName>');
  console.error('Example: node .github/scripts/update-image.js particleFMAT');
  console.error('\nThis looks for <imageName>_updated.png in .github/raw_images/');
  console.error('\nAvailable names:');
  Object.keys(imageMap).forEach(k => console.error(`  ${k} -> ${imageMap[k]}.png`));
  process.exit(1);
}

updateImage(imageName).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
