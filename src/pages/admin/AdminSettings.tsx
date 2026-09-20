import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SiteSettings } from '../../types';
import { isSupabaseConfigured, SUPABASE_SCHEMA_SQL } from '../../lib/supabase';
import {
  Save,
  RotateCcw,
  Palette,
  Truck,
  Phone,
  Database,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const {
    siteSettings,
    updateSiteSettings,
    resetToDefaultData,
    showToast,
    isFirebaseActive,
    firebaseProjectId,
    firebaseDatabaseId,
    firebaseUser,
    loginWithGoogle,
    logoutFirebase,
    syncWithFirebase,
  } = useStore();

  const [formData, setFormData] = useState<SiteSettings>({ ...siteSettings });
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    showToast('Settings Saved ✨', 'Atelier configuration and branding updated');
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    showToast('SQL Schema Copied', 'Paste this directly into your Supabase SQL editor');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all store settings to default artisanal configuration?')) {
      resetToDefaultData();
      setFormData({ ...siteSettings });
    }
  };

  const handleFirebaseSync = async () => {
    setIsSyncingFirebase(true);
    try {
      const res = await syncWithFirebase();
      if (res.success) {
        showToast('Firebase Synced ⚡', res.message, 'success');
      } else {
        showToast('Sync Notice', res.message, 'error');
      }
    } finally {
      setIsSyncingFirebase(false);
    }
  };

  const isCloudConnected = isSupabaseConfigured;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#2D1810]/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#23120B]">
            Atelier Brand &amp; Storefront Settings
          </h3>
          <p className="text-xs text-[#3E2723]/60">
            Control brand colors, delivery thresholds, contact info, and cloud database parameters.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        {/* Section 1: Brand Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#2D1810]/10 shadow-xs space-y-4">
          <h4 className="font-serif text-base font-bold text-[#23120B] flex items-center gap-2 border-b border-[#2D1810]/10 pb-2">
            <Sparkles className="w-4 h-4 text-[#C59B27]" />
            <span>1. Brand Identity &amp; Positioning</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#23120B] mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={formData.brandName}
                onChange={(e) => handleChange('brandName', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#23120B] mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#23120B] mb-1">Brand Story &amp; Origin</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
            />
          </div>
        </div>

        {/* Section 2: Colors & Visual Palette */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#2D1810]/10 shadow-xs space-y-4">
          <h4 className="font-serif text-base font-bold text-[#23120B] flex items-center gap-2 border-b border-[#2D1810]/10 pb-2">
            <Palette className="w-4 h-4 text-[#C59B27]" />
            <span>2. Visual Palette &amp; Colors</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-[#23120B] mb-1">
                Primary Dark Tone
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-[#2D1810]/15 p-1 bg-white"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="flex-1 p-2 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#23120B] mb-1">
                Secondary Cocoa Tone
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-[#2D1810]/15 p-1 bg-white"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="flex-1 p-2 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#23120B] mb-1">
                Artisanal Accent Gold
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-[#2D1810]/15 p-1 bg-white"
                />
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className="flex-1 p-2 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Delivery Logistics & Payments */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#2D1810]/10 shadow-xs space-y-4">
          <h4 className="font-serif text-base font-bold text-[#23120B] flex items-center gap-2 border-b border-[#2D1810]/10 pb-2">
            <Truck className="w-4 h-4 text-[#C59B27]" />
            <span>3. Delivery Logistics &amp; Checkout Rules</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-[#23120B] mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => handleChange('currencySymbol', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl font-bold text-center"
              />
            </div>

            <div>
              <label className="block font-bold text-[#23120B] mb-1">
                Free Delivery Over ({formData.currencySymbol})
              </label>
              <input
                type="number"
                min={0}
                value={formData.freeDeliveryThreshold}
                onChange={(e) => handleChange('freeDeliveryThreshold', Number(e.target.value))}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-[#23120B] mb-1">
                Standard Delivery ({formData.currencySymbol})
              </label>
              <input
                type="number"
                min={0}
                value={formData.defaultDeliveryFee}
                onChange={(e) => handleChange('defaultDeliveryFee', Number(e.target.value))}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-[#23120B] mb-1">
                Express 2-Hour Extra ({formData.currencySymbol})
              </label>
              <input
                type="number"
                min={0}
                value={formData.expressDeliveryFee}
                onChange={(e) => handleChange('expressDeliveryFee', Number(e.target.value))}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#23120B]">
              <input
                type="checkbox"
                checked={formData.enableCod}
                onChange={(e) => handleChange('enableCod', e.target.checked)}
                className="w-4 h-4 accent-[#C59B27]"
              />
              <span>Allow Cash on Delivery (COD)</span>
            </label>
          </div>
        </div>

        {/* Section 4: Contact & Concierge Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#2D1810]/10 shadow-xs space-y-4">
          <h4 className="font-serif text-base font-bold text-[#23120B] flex items-center gap-2 border-b border-[#2D1810]/10 pb-2">
            <Phone className="w-4 h-4 text-[#C59B27]" />
            <span>4. Concierge &amp; Kitchen Coordinates</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-[#23120B] mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.contactNumber}
                onChange={(e) => handleChange('contactNumber', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-[#23120B] mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-[#23120B] mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#23120B] mb-1">Kitchen Physical Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl"
            />
          </div>
        </div>

        {/* Section 5: Top Announcement Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#2D1810]/10 shadow-xs space-y-4">
          <h4 className="font-serif text-base font-bold text-[#23120B] border-b border-[#2D1810]/10 pb-2">
            5. Top Announcement Banner
          </h4>

          <div>
            <label className="block font-bold text-[#23120B] mb-1">Announcement Text</label>
            <input
              type="text"
              value={formData.announcementBarText || ''}
              onChange={(e) => handleChange('announcementBarText', e.target.value)}
              className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-[#23120B]">
            <input
              type="checkbox"
              checked={formData.announcementBarActive}
              onChange={(e) => handleChange('announcementBarActive', e.target.checked)}
              className="w-4 h-4 accent-[#C59B27]"
            />
            <span>Show Announcement Bar on Storefront</span>
          </label>
        </div>

        {/* Section 6: Firebase Cloud Database & Backend Status */}
        <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#2D1810]/15 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="font-serif text-base font-bold text-[#23120B] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#C59B27]" />
              <span>6. Firebase Firestore Backend &amp; Cloud Sync</span>
            </h4>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isFirebaseActive
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Firebase Live Connected</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-[#2D1810]/10">
              <span className="text-[10px] uppercase font-bold text-[#3E2723]/60 block mb-0.5">Firebase Project</span>
              <span className="font-mono font-bold text-[#23120B]">{firebaseProjectId}</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-[#2D1810]/10">
              <span className="text-[10px] uppercase font-bold text-[#3E2723]/60 block mb-0.5">Firestore Database</span>
              <span className="font-mono font-bold text-[#23120B] truncate block" title={firebaseDatabaseId}>
                {firebaseDatabaseId}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#3E2723]/80 leading-relaxed">
            All customer orders, products, categories, reviews, and store configurations sync in real time directly with your provisioned Google Cloud Firebase Firestore database with instant reactivity and security rules active.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              disabled={isSyncingFirebase}
              onClick={handleFirebaseSync}
              className="px-4 py-2.5 bg-[#23120B] hover:bg-[#C59B27] disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center gap-2 text-xs"
            >
              <Database className="w-3.5 h-3.5 text-[#DFB15B]" />
              <span>{isSyncingFirebase ? 'Syncing to Firestore...' : 'Test & Sync Firestore'}</span>
            </button>

            {firebaseUser ? (
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#2D1810]/15">
                <span className="text-xs text-[#23120B]">
                  Logged in as <strong className="font-semibold">{firebaseUser.email}</strong>
                </span>
                <button
                  type="button"
                  onClick={logoutFirebase}
                  className="text-xs text-rose-600 hover:underline font-semibold ml-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={loginWithGoogle}
                className="px-4 py-2.5 bg-white hover:bg-gray-50 text-[#23120B] font-bold rounded-xl transition-colors border border-[#2D1810]/20 flex items-center gap-2 text-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Sign-In</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopySql}
              className="px-3.5 py-2.5 bg-white hover:bg-gray-50 text-[#3E2723]/70 font-semibold rounded-xl transition-colors border border-[#2D1810]/15 flex items-center gap-1.5 text-xs ml-auto"
              title="Copy relational SQL schema backup"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[#3E2723]/50" />}
              <span>{copiedSql ? 'SQL Copied!' : 'Export SQL Schema'}</span>
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#23120B] hover:bg-[#C59B27] text-white font-bold text-sm rounded-xl transition-colors shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#DFB15B]" />
            <span>Save All Atelier Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
