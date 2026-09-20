import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Lock, ArrowRight, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToStore }) => {
  const { adminLogin, siteSettings } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = adminLogin(password);
    if (ok) {
      onSuccess();
    } else {
      setError('Incorrect master security key. Default passcode is "admin123"');
    }
  };

  return (
    <div className="min-h-screen bg-[#23120B] text-[#FAF7F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#2D1810] border border-[#C59B27]/30 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#C59B27] text-[#23120B] flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDFBF7]">
            {siteSettings.brandName} Atelier
          </h2>
          <p className="text-xs text-[#EADBC8]/70">
            Administrative Management Console
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#DFB15B] mb-1.5">
              Atelier Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: admin123)"
                className="w-full pl-10 pr-4 py-3 bg-[#1A0B06] border border-[#C59B27]/40 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-hidden focus:border-[#DFB15B]"
              />
              <Lock className="w-4 h-4 text-[#C59B27] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#C59B27] hover:bg-[#DFB15B] text-[#23120B] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Unlock Atelier Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#EADBC8]/60">
          <span>Demo Passcode: <strong>admin123</strong></span>
          <button
            onClick={onBackToStore}
            className="text-[#DFB15B] hover:underline"
          >
            Back to Storefront &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
