const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

// Mapping of source images to destination filenames
const imageMap = {
  'clusteredLights.png': 'clusteredLighting.png',
  'texturedAreaLights.png': 'texturedAreaLights.png',
  'NPE.png': 'nodeParticleEditor.png',
  'particleFMAT.png': 'particleFlowMaps.png',
  'volumetricLighting.png': 'volumetricLighting.png',
  'frameGraph.png': 'frameGraph.png',
  'animationRetargeting.png': 'animationRetargeting.png',
  'GaussianSplat.png': 'gaussianSplat.png',
  'editor.png': 'babylonEditor.png',
  'inspectorV2.png': 'inspectorV2.png',
  'viewer.png': 'viewerUpdates.png',
  'playground.png': 'playgroundUpdates.png',
  'largeWorld.png': 'largeWorldRendering.png',
  'geoSpatialCamera.png': 'geospatialCamera.png',
  '3DTiles.png': '3dTiles.png',
  'atmospheric.png': 'physicallyBasedAtmosphere.png',
  'openPBR.png': 'openPBR.png',
  'IBLShadows.png': 'dynamicIBLShadows.png',
  'sdf.png': 'sdfText.png',
  'outlineRenderer.png': 'outlineRenderer.png',
  'navMesh.png': 'navMesh.png',
  'audio.png': 'audioEngine.png',
  '3mf.png': '3mfExporter.png'
};

const sourceDir = './.github/raw_images';
const destDir = './src/assets/img';

async function getEdgeColor(imagePath) {
  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    // Extract a 1px wide strip from the right edge, middle height
    const edgeStrip = await image
      .extract({ 
        left: metadata.width - 1, 
        top: Math.floor(metadata.height / 2), 
        width: 1, 
        height: 1 
      })
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const { data, info } = edgeStrip;
    
    // Get RGB values
    const r = data[0];
    const g = data[1];
    const b = data[2];
    
    // Convert to hex
    const hex = '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
    
    return hex;
  } catch (error) {
    console.error(`Error sampling color from ${imagePath}:`, error.message);
    return '#000000';
  }
}

async function processImage(sourceFile, destFile) {
  const sourcePath = path.join(sourceDir, sourceFile);
  const destPath = path.join(destDir, destFile);
  
  try {
    // Get edge color before resizing
    const bgColor = await getEdgeColor(sourcePath);
    
    // Resize and optimize
    await sharp(sourcePath)
      .resize(550, null, { // 550px wide, maintain aspect ratio
        withoutEnlargement: true // Don't enlarge if already smaller
      })
      .png({ 
        compressionLevel: 9, // Maximum compression
        palette: true, // Use palette if possible for smaller size
        quality: 80 // Quality setting
      })
      .toFile(destPath);
    
    const stats = await fs.stat(destPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    
    console.log(`✓ ${sourceFile} -> ${destFile} (${sizeKB} KB) [BG: ${bgColor}]`);
    
    return {
      sourceFile,
      destFile,
      bgColor,
      size: sizeKB
    };
  } catch (error) {
    console.error(`✗ Failed to process ${sourceFile}:`, error.message);
    return null;
  }
}

async function processAllImages() {
  console.log('Starting image processing...\n');
  
  // Check if source directory exists
  if (!await fs.pathExists(sourceDir)) {
    console.error(`Error: Source directory ${sourceDir} does not exist!`);
    return;
  }
  
  // Ensure destination directory exists
  await fs.ensureDir(destDir);
  console.log(`Destination directory: ${destDir}\n`);
  
  const results = [];
  
  for (const [sourceFile, destFile] of Object.entries(imageMap)) {
    const sourcePath = path.join(sourceDir, sourceFile);
    if (!await fs.pathExists(sourcePath)) {
      console.log(`⚠ Skipping ${sourceFile} - not found`);
      continue;
    }
    
    const result = await processImage(sourceFile, destFile);
    if (result) {
      results.push(result);
    }
  }
  
  if (results.length === 0) {
    console.log('\n✗ No images were processed');
    return;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY - Background Colors for config.json:');
  console.log('='.repeat(60));
  
  results.forEach(r => {
    console.log(`${r.destFile.padEnd(35)} -> ${r.bgColor}`);
  });
  
  console.log('\n✓ All images processed successfully!');
  console.log(`Total images: ${results.length}`);
  console.log(`Total size: ${results.reduce((sum, r) => sum + parseFloat(r.size), 0).toFixed(2)} KB`);
  
  // Write colors to a file for easy copying
  const colorMap = {};
  results.forEach(r => {
    colorMap[r.destFile] = r.bgColor;
  });
  await fs.writeJSON('./.github/image-colors.json', colorMap, { spaces: 2 });
  console.log('\n📝 Background colors saved to .github/image-colors.json');
}

processAllImages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
