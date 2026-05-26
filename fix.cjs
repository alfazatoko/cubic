const fs = require('fs');
const files = [
    'src/views/RiwayatView.tsx',
    'src/views/OtomatisView.tsx',
    'src/views/LaporanView.tsx',
    'src/views/BerandaView.tsx',
    'src/components/TransactionForm.tsx',
    'src/App.tsx'
];
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('getCategories} from') && !content.includes('import { getCategories }')) {
        let importPath = f === 'src/App.tsx' ? './lib/utils' : '../lib/utils';
        content = `import { getCategories } from '${importPath}';\n` + content;
        fs.writeFileSync(f, content, 'utf8');
        console.log('Fixed imports in', f);
    }
});
