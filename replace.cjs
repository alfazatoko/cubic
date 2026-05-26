const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/'Transfer Bank'/g, "'TRANSFER BANK'")
    .replace(/"Transfer Bank"/g, '"TRANSFER BANK"')
    .replace(/'FLIP'/g, "'APLIKASI PPOB'")
    .replace(/"FLIP"/g, '"APLIKASI PPOB"')
    .replace(/'Order Kuota'/g, "'ORDERKUOTA'")
    .replace(/"Order Kuota"/g, '"ORDERKUOTA"');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated', filePath);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  });
}

walk('./src');
