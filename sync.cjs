const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace arrays
  content = content.replace(/\['TRANSFER BANK', 'DANA', 'APLIKASI PPOB', 'ORDERKUOTA'\]/g, "getCategories()");
  content = content.replace(/\['Semua', 'TRANSFER BANK', 'DANA', 'APLIKASI PPOB', 'ORDERKUOTA', 'Tarik Tunai', 'Aksesoris'\]/g, "['Semua', ...getCategories(), 'Tarik Tunai', 'Aksesoris']");
  content = content.replace(/\['TRANSFER BANK', 'DANA', 'APLIKASI PPOB', 'ORDERKUOTA', 'Tarik Tunai'\]/g, "[...getCategories(), 'Tarik Tunai']");
  content = content.replace(/\['ORDERKUOTA', 'TRANSFER BANK', 'DANA', 'APLIKASI PPOB', 'Tarik Tunai'\]/g, "[...getCategories(), 'Tarik Tunai']");
  content = content.replace(/\['TRANSFER BANK', 'DANA', 'APLIKASI PPOB', 'ORDERKUOTA', 'Tarik Tunai', 'Aksesoris', 'Transaksi Khusus'\]/g, "[...getCategories(), 'Tarik Tunai', 'Aksesoris', 'Transaksi Khusus']");

  if (content !== originalContent) {
    // Add import if not present
    if (!content.includes('getCategories')) {
      let importPath = filePath.includes('App.tsx') ? './lib/utils' : '../lib/utils';
      
      if (content.includes('import ') && content.includes(importPath)) {
        content = content.replace(
          new RegExp(`import \\{([^}]+)\\} from ['"]${importPath}['"]`),
          (match, p1) => {
            if (p1.includes('getCategories')) return match;
            return `import { ${p1.trim()}, getCategories } from '${importPath}'`;
          }
        );
      } else {
        const lines = content.split('\n');
        const lastImportIndex = lines.findLastIndex(l => l.trim().startsWith('import '));
        if (lastImportIndex !== -1) {
            lines.splice(lastImportIndex + 1, 0, `import { getCategories } from '${importPath}';`);
            content = lines.join('\n');
        }
      }
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

const filesToUpdate = [
    'src/views/RiwayatView.tsx',
    'src/views/OtomatisView.tsx',
    'src/views/LaporanView.tsx',
    'src/views/BerandaView.tsx',
    'src/components/TransactionForm.tsx',
    'src/App.tsx'
];

filesToUpdate.forEach(f => {
    const p = path.join(__dirname, f);
    if (fs.existsSync(p)) {
        replaceInFile(p);
    }
});
