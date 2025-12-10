import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { settingsAPI } from '../../api/client';
import { toast } from 'sonner';

const SettingsManagement = () => {
  const [formData, setFormData] = useState({
    site_name: '',
    logo: '',
    tagline: '',
    whatsapp_number: '',
    telegram_username: '',
    footer_text: '',
    social_links: {
      instagram: '',
      twitter: '',
      facebook: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.get();
      setFormData({
        site_name: response.data.site_name || '',
        logo: response.data.logo || '',
        tagline: response.data.tagline || '',
        whatsapp_number: response.data.whatsapp_number || '',
        telegram_username: response.data.telegram_username || '',
        footer_text: response.data.footer_text || '',
        social_links: response.data.social_links || {
          instagram: '',
          twitter: '',
          facebook: '',
        },
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Gagal memuat settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await settingsAPI.update(formData);
      toast.success('Settings berhasil diupdate');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div data-testid="settings-management">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings Management</h1>
        <p className="text-slate-400">Manage global website configuration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Information */}
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-xl font-semibold text-white">Site Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Site Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                data-testid="settings-sitename-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
                placeholder="DomainPBN"
              />
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                data-testid="settings-logo-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              data-testid="settings-tagline-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              placeholder="Premium PBN Backlinks - Harga Murah, Kualitas Tinggi"
            />
          </div>

          {/* Footer Text */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Footer Text
            </label>
            <textarea
              value={formData.footer_text}
              onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
              data-testid="settings-footer-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-3 text-white"
              rows="3"
              placeholder="DomainPBN © 2024. Premium Backlinks untuk SEO Anda."
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-xl font-semibold text-white">Contact Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                data-testid="settings-whatsapp-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
                placeholder="6281234567890"
              />
              <p className="text-xs text-slate-500 mt-1">Format: 628xxx (dengan kode negara, tanpa +)</p>
            </div>

            {/* Telegram */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Telegram Username
              </label>
              <input
                type="text"
                value={formData.telegram_username}
                onChange={(e) => setFormData({ ...formData, telegram_username: e.target.value })}
                data-testid="settings-telegram-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
                placeholder="domainpbn"
              />
              <p className="text-xs text-slate-500 mt-1">Tanpa @ symbol</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-xl font-semibold text-white">Social Media Links</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Instagram */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.social_links.instagram}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, instagram: e.target.value }
                })}
                data-testid="settings-instagram-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
                placeholder="https://instagram.com/domainpbn"
              />
            </div>

            {/* Twitter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Twitter/X URL
              </label>
              <input
                type="url"
                value={formData.social_links.twitter}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, twitter: e.target.value }
                })}
                data-testid="settings-twitter-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
                placeholder="https://twitter.com/domainpbn"
              />
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.social_links.facebook}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, facebook: e.target.value }
                })}
                data-testid="settings-facebook-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
                placeholder="https://facebook.com/domainpbn"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            data-testid="settings-submit-button"
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-8 py-3 font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={20} />
                Simpan Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManagement;
