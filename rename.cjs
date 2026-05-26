const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replacements
  content = content.replace(/ALFAZA CELL/g, 'CUBIC CLOUD');
  content = content.replace(/ALFAZA_TRANSAKSI_/g, 'CUBIC_TRANSAKSI_');
  content = content.replace(/demo@alfaza\.com/g, 'demo@cubiccloud.com');
  
  content = content.replace(/ALPHA - Agen BRILink/g, 'KASIR CUBIC');
  content = content.replace(/ALPHA_BACKUP_/g, 'CUBIC_BACKUP_');
  content = content.replace(/Backup Data ALPHA/g, 'Backup Data CUBIC');
  content = content.replace(/ALPHA Logo/g, 'CUBIC Logo');
  
  // Some other texts where ALPHA is used
  content = content.replace(/Aplikasi Kasir ALPHA/g, 'Aplikasi KASIR CUBIC');
  content = content.replace(/Aplikasi ALPHA/g, 'Aplikasi CUBIC');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  });
}

walkDir(path.join(__dirname, 'src'));
console.log('Done replacing texts!');
