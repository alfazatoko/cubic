import React, { useState } from 'react';

interface LicenseScreenProps {
  onValid: () => void;
}

const LicenseScreen: React.FC<LicenseScreenProps> = ({ onValid }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Kode lisensi tidak boleh kosong');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const storedLicenses = JSON.parse(localStorage.getItem('cubic_admin_licenses') || '[]');
        const licenseIndex = storedLicenses.findIndex((l: any) => l.id === code.trim());

        if (licenseIndex === -1) {
          setError('Kode lisensi tidak valid atau tidak ditemukan');
          setLoading(false);
          return;
        }

        const license = storedLicenses[licenseIndex];

        let deviceId = localStorage.getItem('cubic_device_id');
        if (!deviceId) {
          deviceId = `DEV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
          localStorage.setItem('cubic_device_id', deviceId);
        }

        const activeDevices = license.activeDevices || [];
        const isDeviceAlreadyRegistered = activeDevices.includes(deviceId);

        if (!isDeviceAlreadyRegistered) {
          const maxDevices = license.maxDevices || 7;
          if (activeDevices.length >= maxDevices) {
            setError(`Lisensi ini sudah mencapai batas maksimal (${maxDevices} perangkat).`);
            setLoading(false);
            return;
          }
          
          // Daftarkan device baru ke lisensi
          activeDevices.push(deviceId);
          storedLicenses[licenseIndex].activeDevices = activeDevices;
          localStorage.setItem('cubic_admin_licenses', JSON.stringify(storedLicenses));
        }

        // Simpan lisensi aktif ke perangkat ini
        localStorage.setItem('cubic_license_active', JSON.stringify({
          id: license.id,
          type: license.type,
          activatedAt: new Date().toISOString(),
          expiresAt: license.expiresAt
        }));

        alert(`Aktivasi berhasil! Lisensi ${license.type.toUpperCase()} diaktifkan.`);
        onValid();
      } catch (err) {
        setError('Terjadi kesalahan sistem saat memvalidasi lisensi');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700 shadow-2xl relative z-10 text-center">
        <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
          <i className="fa-solid fa-key text-3xl"></i>
        </div>

        <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Aktivasi Lisensi</h1>
        <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8">
          Aplikasi ini memerlukan lisensi aktif untuk digunakan. Silakan masukkan kode lisensi yang valid.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold p-3 rounded-xl mb-6 uppercase tracking-wider text-left flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-base shrink-0"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Kode Lisensi</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="CUBIC-XXX-XXXXXX"
              className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-2xl px-4 py-4 text-sm font-black text-white text-center tracking-[0.2em] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                Memvalidasi...
              </>
            ) : (
              <>
                <i className="fa-solid fa-shield-check"></i>
                Aktivasi Sekarang
              </>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-700/50 pt-6">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-3">
            Belum punya lisensi? Hubungi admin
          </p>
          <a
            href={`https://wa.me/${(() => {
              try {
                const cfg = JSON.parse(localStorage.getItem('cubic_admin_config') || '{}');
                return cfg.waNumber || '6287824889706';
              } catch { return '6287824889706'; }
            })()}?text=Halo%20Admin%2C%20saya%20ingin%20mendapatkan%20lisensi%20CUBIC.`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-900/30"
          >
            <i className="fa-brands fa-whatsapp text-lg"></i>
            Hubungi Admin via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default LicenseScreen;
