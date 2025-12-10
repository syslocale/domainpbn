import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { pbnAPI } from '../../api/client';
import { toast } from 'sonner';

const PBNForm = ({ site, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    code: '',
    domain_real: '',
    niche: '',
    dr: 0,
    da: 0,
    traffic: 0,
    spam_score: 0,
    age: 0,
    price_per_post: 0,
    status: 'active',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (site) {
      setFormData({
        code: site.code || '',
        domain_real: site.domain_real || '',
        niche: site.niche || '',
        dr: site.dr || 0,
        da: site.da || 0,
        traffic: site.traffic || 0,
        spam_score: site.spam_score || 0,
        age: site.age || 0,
        price_per_post: site.price_per_post || 0,
        status: site.status || 'active',
        notes: site.notes || '',
      });
    }
  }, [site]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.code || !formData.domain_real || !formData.niche) {
      toast.error('Code, domain, dan niche wajib diisi');
      return;
    }

    try {
      setLoading(true);
      if (site) {
        await pbnAPI.update(site.id, formData);
        toast.success('PBN site berhasil diupdate');
      } else {
        await pbnAPI.create(formData);
        toast.success('PBN site berhasil dibuat');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving site:', error);
      toast.error('Gagal menyimpan PBN site');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="pbn-form">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {site ? 'Edit PBN Site' : 'Tambah PBN Site'}
            </h1>
            <p className="text-slate-400">Manage PBN network metrics dan informasi</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-xl font-semibold text-white">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Code <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                data-testid="pbn-code-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
                placeholder="PBN-001"
                required
              />
            </div>

            {/* Domain */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Domain Real <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.domain_real}
                onChange={(e) => setFormData({ ...formData, domain_real: e.target.value })}
                data-testid="pbn-domain-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
                placeholder="example.com"
                required
              />
            </div>

            {/* Niche */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Niche <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                data-testid="pbn-niche-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
                placeholder="Technology, Finance, Health, dll"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                data-testid="pbn-status-select"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              >
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-xl font-semibold text-white">Metrics</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* DR */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Domain Rating (DR)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.dr}
                onChange={(e) => setFormData({ ...formData, dr: parseInt(e.target.value) || 0 })}
                data-testid="pbn-dr-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              />
            </div>

            {/* DA */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Domain Authority (DA)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.da}
                onChange={(e) => setFormData({ ...formData, da: parseInt(e.target.value) || 0 })}
                data-testid="pbn-da-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              />
            </div>

            {/* Traffic */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Monthly Traffic
              </label>
              <input
                type="number"
                min="0"
                value={formData.traffic}
                onChange={(e) => setFormData({ ...formData, traffic: parseInt(e.target.value) || 0 })}
                data-testid="pbn-traffic-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              />
            </div>

            {/* Spam Score */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Spam Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.spam_score}
                onChange={(e) => setFormData({ ...formData, spam_score: parseFloat(e.target.value) || 0 })}
                data-testid="pbn-spam-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Domain Age (years)
              </label>
              <input
                type="number"
                min="0"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                data-testid="pbn-age-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Price per Post (IDR)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.price_per_post}
                onChange={(e) => setFormData({ ...formData, price_per_post: parseInt(e.target.value) || 0 })}
                data-testid="pbn-price-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-xl font-semibold text-white">Additional Notes</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Internal Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              data-testid="pbn-notes-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-3 text-white"
              rows="3"
              placeholder="Catatan internal tentang PBN site ini..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-6 py-3 font-medium transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            data-testid="pbn-submit-button"
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-6 py-3 font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={20} />
                {site ? 'Update' : 'Simpan'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PBNForm;
