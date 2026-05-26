import React, { useState, useEffect } from 'react';// Icons using FontAwesome (since CUBIC uses FontAwesome mostly based on App.tsx)
// But we will use standard classes for icons like fa-solid fa-shield-halved, etc.

interface AdminViewProps {
  active: boolean;
  isPc: boolean;
  setActiveView: (view: string) => void;
}

export default function AdminView({ active }: AdminViewProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<"demo" | "4_months" | "lifetime">("demo");
  const [requireLicense, setRequireLicense] = useState(true);
  const [genEmail, setGenEmail] = useState("");
  const [waNumber, setWaNumber] = useState("6287824889706");
  const [waSaving, setWaSaving] = useState(false);
  const [lockOwnerMode, setLockOwnerMode] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated && active) {
      loadData();
    }
  }, [authenticated, active]);

  const loadData = async () => {
    setLoading(true);
    setLoadingFeedbacks(true);

    try {
      // Mocking data for now if tables don't exist, using localStorage as fallback
      // In a real scenario, you'd fetch from Supabase
      
      const localLicenses = localStorage.getItem('cubic_admin_licenses');
      if (localLicenses) setLicenses(JSON.parse(localLicenses));

      const localFeedbacks = localStorage.getItem('cubic_admin_feedbacks');
      if (localFeedbacks) setFeedbacks(JSON.parse(localFeedbacks));

      const sysConfig = localStorage.getItem('cubic_admin_config');
      if (sysConfig) {
        const config = JSON.parse(sysConfig);
        setRequireLicense(config.requireLicense ?? true);
        setLockOwnerMode(config.lockOwnerMode ?? false);
        setWaNumber(config.waNumber || "6287824889706");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingFeedbacks(false);
    }
  };

  const saveConfig = (newConfig: any) => {
    const sysConfig = localStorage.getItem('cubic_admin_config');
    const current = sysConfig ? JSON.parse(sysConfig) : {};
    const updated = { ...current, ...newConfig };
    localStorage.setItem('cubic_admin_config', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Umbui123@") {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Password salah!");
    }
  };

  const handleGenerate = async () => {
    if (!selectedType) return;
    if (!genEmail || !genEmail.includes("@")) {
      alert("Masukkan email pendaftaran yang valid!");
      return;
    }
    setGenerating(true);
    
    try {
      const newLicense = {
        id: `LIC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        type: selectedType,
        registeredEmail: genEmail,
        createdAt: new Date().toISOString(),
        expiresAt: selectedType === "demo" ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : selectedType === "4_months" ? new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString() : null,
        activeDevices: [],
        maxDevices: 7
      };

      const updated = [newLicense, ...licenses];
      setLicenses(updated);
      localStorage.setItem('cubic_admin_licenses', JSON.stringify(updated));
      
      setGenEmail("");
      alert("Lisensi berhasil dibuat!");
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Hapus lisensi ini?")) return;
    const updated = licenses.filter(l => l.id !== id);
    setLicenses(updated);
    localStorage.setItem('cubic_admin_licenses', JSON.stringify(updated));
  };

  const handleDeleteFeedback = (id: string) => {
    if (!window.confirm("Hapus masukan ini?")) return;
    const updated = feedbacks.filter(f => f.id !== id);
    setFeedbacks(updated);
    localStorage.setItem('cubic_admin_feedbacks', JSON.stringify(updated));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Kode lisensi disalin!");
  };

  const toggleRequireLicense = () => {
    const newVal = !requireLicense;
    setRequireLicense(newVal);
    saveConfig({ requireLicense: newVal });
  };

  const toggleLockOwnerMode = () => {
    const newVal = !lockOwnerMode;
    setLockOwnerMode(newVal);
    saveConfig({ lockOwnerMode: newVal });
  };

  const saveWaNumber = () => {
    setWaSaving(true);
    setTimeout(() => {
      saveConfig({ waNumber });
      alert("Nomor WhatsApp berhasil disimpan!");
      setWaSaving(false);
    }, 500);
  };


  if (!active) return null;

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white dark:bg-slate-800 p-8 rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 dark:border-slate-700">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
              <i className="fa-solid fa-shield-halved text-3xl"></i>
            </div>
          </div>
          <h2 className="text-2xl font-black text-center text-slate-800 dark:text-white mb-2">Admin Panel</h2>
          <p className="text-center text-slate-500 text-sm mb-6">Masukkan password rahasia</p>
          
          {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold p-3 rounded-xl mb-4 text-center">{error}</div>}
          
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 pr-12 outline-none focus:border-blue-500 transition dark:text-white"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl hover:bg-blue-700 transition">
            MASUK
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 p-4 pb-20 overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto">
        <div className="bg-blue-600 rounded-3xl p-6 text-white mb-6 shadow-lg flex items-center gap-4">
          <i className="fa-solid fa-shield-halved text-4xl"></i>
          <div>
            <h1 className="text-2xl font-black">License Manager</h1>
            <p className="text-blue-100 text-sm">Kelola kode aktivasi CUBIC</p>
          </div>
        </div>

        {/* FEEDBACKS */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-phone text-blue-600"></i> CHAT SARAN & KRITIK
            </h3>
            <button onClick={loadData} className="text-blue-600 text-xs font-bold hover:underline">
              Refresh
            </button>
          </div>

          {loadingFeedbacks ? (
            <div className="flex justify-center py-6"><i className="fa-solid fa-circle-notch fa-spin text-blue-500 text-2xl"></i></div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm">Belum ada pesan masuk.</div>
          ) : (
            <div className="space-y-3">
              {feedbacks.map(f => (
                <div 
                  key={f.id} 
                  onClick={() => setExpandedFeedbackId(expandedFeedbackId === f.id ? null : f.id)}
                  className={`border border-slate-100 dark:border-slate-700 rounded-2xl p-4 transition-all cursor-pointer ${expandedFeedbackId === f.id ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#0088cc] flex items-center justify-center text-white font-bold text-xs">
                        {f.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white">{f.name}</h4>
                        <p className="text-[10px] text-slate-400">{f.phone} • {new Date(f.createdAt).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteFeedback(f.id); }}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                  <p className={`text-xs text-slate-600 dark:text-slate-300 leading-relaxed ${expandedFeedbackId === f.id ? '' : 'line-clamp-1'}`}>
                    {f.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SYSTEM CONFIG */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-shield text-blue-500"></i> Sistem Lisensi
            </h3>
            <button 
              onClick={toggleRequireLicense}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${requireLicense ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${requireLicense ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            {requireLicense ? "Aktif: Pengguna wajib memasukkan kode lisensi." : "Nonaktif: Aplikasi bisa digunakan tanpa lisensi."}
          </p>

          <div className="border-t border-slate-100 dark:border-slate-700 pt-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-lock text-rose-500"></i> Lock Owner Mode
            </h3>
            <button 
              onClick={toggleLockOwnerMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${lockOwnerMode ? 'bg-rose-600' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${lockOwnerMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {lockOwnerMode ? "Aktif: Tombol 'MASUK MODE OWNER' terkunci." : "Nonaktif: Tombol owner bisa diklik."}
          </p>
        </div>

        {/* GENERATE LICENSE */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-key text-blue-500"></i> Buat Lisensi Baru
          </h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button 
              onClick={() => setSelectedType("demo")}
              className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-1 sm:gap-2 transition border-2 ${selectedType === "demo" ? "bg-amber-50 dark:bg-amber-900/20 border-amber-500 text-amber-700 dark:text-amber-400" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              <i className="fa-regular fa-clock text-lg"></i>
              <span className="font-bold text-[10px] sm:text-sm text-center leading-tight">Demo<br className="sm:hidden"/>(7 Hari)</span>
            </button>
            <button 
              onClick={() => setSelectedType("4_months")}
              className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-1 sm:gap-2 transition border-2 ${selectedType === "4_months" ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              <i className="fa-regular fa-circle-check text-lg"></i>
              <span className="font-bold text-[10px] sm:text-sm text-center leading-tight">Pro<br className="sm:hidden"/>(4 Bln)</span>
            </button>
            <button 
              onClick={() => setSelectedType("lifetime")}
              className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-1 sm:gap-2 transition border-2 ${selectedType === "lifetime" ? "bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-400" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              <i className="fa-solid fa-infinity text-lg"></i>
              <span className="font-bold text-[10px] sm:text-sm text-center leading-tight">Lifetime</span>
            </button>
          </div>
          <div className="mb-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1 block">Email Pendaftaran</label>
            <input 
              type="email" 
              value={genEmail} 
              onChange={e => setGenEmail(e.target.value)} 
              placeholder="contoh: user@gmail.com" 
              className="w-full border border-slate-200 dark:border-slate-700 bg-transparent rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition dark:text-white"
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generating ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-key"></i>}
            BUAT KODE SEKARANG
          </button>
        </div>

        {/* LICENSE LIST */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white">Daftar Lisensi</h3>
            <button onClick={loadData} className="text-blue-600 text-sm font-semibold hover:underline">
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><i className="fa-solid fa-circle-notch fa-spin text-blue-500 text-3xl"></i></div>
          ) : licenses.length === 0 ? (
            <div className="text-center py-10 text-slate-400">Belum ada lisensi.</div>
          ) : (
            <div className="space-y-3">
              {licenses.map(lic => (
                <div key={lic.id} className="border border-slate-100 dark:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-lg font-black text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg tracking-wider">
                        {lic.id}
                      </code>
                      <button onClick={() => copyToClipboard(lic.id)} className="text-blue-600 hover:text-blue-700">
                        <i className="fa-regular fa-copy"></i>
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={`font-bold px-2 py-0.5 rounded-full ${
                        lic.type === "demo" ? "bg-amber-100 text-amber-600" :
                        lic.type === "4_months" ? "bg-blue-100 text-blue-600" :
                        "bg-purple-100 text-purple-600"
                      }`}>
                        {lic.type.replace("_", " ").toUpperCase()}
                      </span>
                      <span className="text-slate-400">
                        {(lic.activeDevices || []).length} / {Math.max(lic.maxDevices || 0, 7)} HP
                      </span>
                      {lic.registeredEmail && (
                        <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                          {lic.registeredEmail}
                        </span>
                      )}
                      <span className="text-slate-400">
                        Exp: {lic.expiresAt ? new Date(lic.expiresAt).toLocaleDateString('id-ID') : "Lifetime"}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(lic.id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition shrink-0 self-end sm:self-auto">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WA NUMBER */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mt-6">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <i className="fa-brands fa-whatsapp text-emerald-500"></i> Nomor WhatsApp (Hubungi Kami)
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Nomor ini ditampilkan di halaman untuk tombol "Hubungi Kami". Format: 628xxx (tanpa + atau spasi).
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="6287824889706"
              className="flex-1 border border-slate-200 dark:border-slate-700 bg-transparent rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-emerald-500 transition dark:text-white"
            />
            <button
              onClick={saveWaNumber}
              disabled={waSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl transition disabled:opacity-50 flex items-center gap-2"
            >
              {waSaving ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-save"></i>}
              Simpan
            </button>
          </div>
        </div>



        {/* DOWNLOAD BUTTON */}
        <div className="mt-8 mb-10 border-t border-slate-200 dark:border-slate-700 pt-8">
          <button 
            className="w-full bg-slate-800 dark:bg-black hover:bg-slate-900 text-white font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg"
            onClick={() => alert("Fitur unduh source code belum diaktifkan di versi ini.")}
          >
            <i className="fa-solid fa-download"></i>
            DOWNLOAD SOURCE CODE (ZIP)
          </button>
        </div>
      </div>
    </div>
  );
}
