const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replacements
  content = content.replace(/ALPHA <span className="login-title-accent">Cloud<\/span>/g, 'CUBIC <span className="login-title-accent">Cloud</span>');
  content = content.replace(/ALPHA <span className="text-blue-600">Cloud<\/span>/g, 'CUBIC <span className="text-blue-600">Cloud</span>');
  content = content.replace(/ALPHA Pro • Cloud Sync Multi-Tenant/g, 'KASIR CUBIC • Cloud Sync Multi-Tenant');
  content = content.replace(/ALPHA'\} <span className="login-title-accent">\{storeName \? '' : 'Pro'\}/g, "CUBIC'} <span className=\"login-title-accent\">{storeName ? '' : 'Cloud'}");
  content = content.replace(/ALPHA Pro v1\.0/g, 'KASIR CUBIC v1.0');

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
