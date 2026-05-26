const fs = require('fs');

let content = fs.readFileSync('src/views/BerandaView.tsx', 'utf8');

const startIndex = content.indexOf('const KategoriPanel: React.FC<{');
const endIndex = content.indexOf('const BerandaView: React.FC<BerandaViewProps>');

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `const KategoriPanel: React.FC<{
  showToast: (m: string) => void,
  activeStoreId: string
}> = ({ showToast }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [catConfigs, setCatConfigs] = useState<Record<string, string>>({});
  const [newCat, setNewCat] = useState('');
  const [newCatType, setNewCatType] = useState('nominal_admin');

  useEffect(() => {
    const savedCats = localStorage.getItem('alphaPro_categories');
    if (savedCats) {
      setCategories(JSON.parse(savedCats));
    } else {
      // Use fallback if not found
      setCategories(['TRANSFER BANK', 'DANA', 'APLIKASI PPOB', 'ORDERKUOTA']);
    }

    const savedConfigs = localStorage.getItem('alphaPro_categories_config');
    if (savedConfigs) {
      setCatConfigs(JSON.parse(savedConfigs));
    } else {
      setCatConfigs({
        'TRANSFER BANK': 'nominal_admin',
        'DANA': 'nominal_admin',
        'APLIKASI PPOB': 'modal_jual',
        'ORDERKUOTA': 'modal_jual'
      });
    }
  }, []);

  const saveCategories = (cats: string[], configs: Record<string, string>) => {
    setCategories(cats);
    setCatConfigs(configs);
    localStorage.setItem('alphaPro_categories', JSON.stringify(cats));
    localStorage.setItem('alphaPro_categories_config', JSON.stringify(configs));
    showToast('Kategori berhasil disimpan (refresh halaman untuk melihat efeknya)');
  };

  const handleAdd = () => {
    if (!newCat.trim()) return;
    const catUpper = newCat.trim().toUpperCase();
    if (categories.includes(catUpper)) {
      showToast('Kategori sudah ada');
      return;
    }
    
    const newConfigs = { ...catConfigs, [catUpper]: newCatType };
    saveCategories([...categories, catUpper], newConfigs);
    setNewCat('');
  };

  const handleRemove = (cat: string) => {
    if (categories.length <= 1) {
      showToast('Minimal harus ada 1 kategori');
      return;
    }
    const newConfigs = { ...catConfigs };
    delete newConfigs[cat];
    saveCategories(categories.filter(c => c !== cat), newConfigs);
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <i className="fa-solid fa-tags text-lg"></i>
        </div>
        <div>
          <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Kategori Transaksi</h3>
          <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase tracking-widest">Edit atau tambah kategori baru</p>
          <p className="text-[9px] font-medium text-gray-400 mt-1 italic leading-tight">(Nama kategori ini adalah nama-nama aplikasi yang sedang digunakan sebagai sarana transaksi)</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50/50 border border-gray-200 p-4 rounded-2xl space-y-3">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Tambah Kategori Baru</label>
          <div className="flex flex-col gap-3">
            <input 
              type="text"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value.toUpperCase())}
              placeholder="NAMA KATEGORI (Contoh: BNI, MAXIM...)"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setNewCatType('nominal_admin')}
                className={\`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center transition-all \${newCatType === 'nominal_admin' ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}\`}
              >
                <span className="text-[9px] font-black uppercase tracking-widest mb-0.5">NOMINAL & ADMIN</span>
                <span className="text-[7px] text-center opacity-80">(Untuk Transfer/E-Wallet)</span>
              </button>
              <button 
                onClick={() => setNewCatType('modal_jual')}
                className={\`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center transition-all \${newCatType === 'modal_jual' ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}\`}
              >
                <span className="text-[9px] font-black uppercase tracking-widest mb-0.5">MODAL & JUAL</span>
                <span className="text-[7px] text-center opacity-80">(Untuk PPOB/Kuota)</span>
              </button>
            </div>
          </div>

          <button 
            onClick={handleAdd}
            className="w-full bg-rose-600 text-white py-3 mt-1 rounded-xl font-black text-xs uppercase hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-500/20"
          >
            <i className="fa-solid fa-plus mr-1"></i> SIMPAN KATEGORI
          </button>
        </div>

        <div className="space-y-2 mt-4">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block mb-3">Daftar Kategori Saat Ini:</label>
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white border border-gray-100 p-3 rounded-xl shadow-sm hover:border-rose-100 transition-colors group">
              <div>
                <span className="font-black text-xs text-gray-800 uppercase tracking-widest block">{cat}</span>
                <span className="text-[8px] font-bold text-rose-500 uppercase tracking-widest mt-0.5">
                  FORMAT: {catConfigs[cat] === 'modal_jual' ? 'MODAL & HARGA JUAL' : 'NOMINAL & ADMIN'}
                </span>
              </div>
              <button 
                onClick={() => handleRemove(cat)}
                className="w-8 h-8 rounded-full bg-red-50 text-red-500 opacity-50 group-hover:opacity-100 hover:bg-red-100 flex items-center justify-center transition-all"
              >
                <i className="fa-solid fa-trash text-[10px]"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

`;

    const newContent = content.slice(0, startIndex) + replacement + content.slice(endIndex);
    fs.writeFileSync('src/views/BerandaView.tsx', newContent, 'utf8');
    console.log('BerandaView.tsx updated!');
}
