const fs = require('fs');

let content = fs.readFileSync('src/components/TransactionForm.tsx', 'utf8');

// 1. Update imports
content = content.replace("import { getCategories } from '../lib/utils';", "import { getCategories, getCategoriesConfig } from '../lib/utils';");

// 2. Add config init
content = content.replace(
  "const [errorMsg, setErrorMsg] = useState<string | null>(null)",
  "const [errorMsg, setErrorMsg] = useState<string | null>(null)\n  const catConfig = getCategoriesConfig();\n  const isModalJual = (cat: string) => catConfig[cat] === 'modal_jual';"
);

// 3. Update 'ORDERKUOTA' checks
content = content.replace(
  "if (nominal && nominal !== '0' && kategori !== 'ORDERKUOTA')",
  "if (nominal && nominal !== '0' && !isModalJual(kategori))"
);

content = content.replace(
  "if (pCat === 'ORDERKUOTA') {",
  "if (isModalJual(pCat)) {"
);

content = content.replace(
  "{pCat === 'ORDERKUOTA' ",
  "{isModalJual(pCat) "
);

content = content.replace(
  "{kategori === 'ORDERKUOTA' ? 'Modal' : 'Nominal'}",
  "{isModalJual(kategori) ? 'Harga Modal' : 'Nominal'}"
);

content = content.replace(
  "{kategori === 'ORDERKUOTA' ? 'Jual' : 'Admin'}",
  "{isModalJual(kategori) ? 'Harga Jual' : 'Admin'}"
);

fs.writeFileSync('src/components/TransactionForm.tsx', content, 'utf8');
console.log('TransactionForm.tsx updated!');
