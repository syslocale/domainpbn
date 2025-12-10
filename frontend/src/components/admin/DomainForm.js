import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { domainsAPI } from '../../api/client';
import { toast } from 'sonner';

const DomainForm = ({ domain, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    domain_name: '',
    da: 0,
    pa: 0,
    ur: 0,
    dr: 0,
    tf: 0,
    cf: 0,
    price: 0,
    web_archive_history: '',
    age: 0,
    registrar: '',
    status: 'available',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (domain) {
      setFormData({
        domain_name: domain.domain_name || '',
        da: domain.da || 0,
        pa: domain.pa || 0,
        ur: domain.ur || 0,
        dr: domain.dr || 0,
        tf: domain.tf || 0,
        cf: domain.cf || 0,
        price: domain.price || 0,
        web_archive_history: domain.web_archive_history || '',
        age: domain.age || 0,
        registrar: domain.registrar || '',
        status: domain.status || 'available',
        notes: domain.notes || '',
      });
    }
  }, [domain]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.domain_name || !formData.registrar) {
      toast.error('Domain name dan registrar wajib diisi');
      return;
    }

    try {
      setLoading(true);
      if (domain) {
        await domainsAPI.update(domain.id, formData);
        toast.success('Domain berhasil diupdate');
      } else {
        await domainsAPI.create(formData);
        toast.success('Domain berhasil dibuat');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving domain:', error);
      toast.error('Gagal menyimpan domain');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="domain-form">
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
              {domain ? 'Edit Domain' : 'Tambah Domain'}
            </h1>
            <p className="text-slate-400">Manage aged/expired domain listing</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-xl font-semibold text-white">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Domain Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Domain Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.domain_name}
                onChange={(e) => setFormData({ ...formData, domain_name: e.target.value })}
                data-testid="domain-name-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
                placeholder="example.com"
                required
              />
            </div>

            {/* Registrar */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Registrar <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.registrar}
                onChange={(e) => setFormData({ ...formData, registrar: e.target.value })}
                data-testid="domain-registrar-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
                placeholder="GoDaddy, Namecheap, dll"
                required
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Age (years)
              </label>
              <input
                type="number"
                min="0"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                data-testid="domain-age-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
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
                data-testid="domain-status-select"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Price (IDR)
              </label>
              <input
                type="number"
                min="0"
                step="100000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                data-testid="domain-price-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              />
            </div>
          </div>

          {/* Web Archive History */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Web Archive History URL
            </label>
            <input
              type="url"
              value={formData.web_archive_history}
              onChange={(e) => setFormData({ ...formData, web_archive_history: e.target.value })}
              data-testid="domain-archive-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              placeholder="https://web.archive.org/web/*/example.com"
            />
            <p className="text-xs text-slate-500 mt-1">Link ke Wayback Machine untuk history domain</p>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-xl font-semibold text-white">Domain Metrics</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {/* DR */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                DR (Domain Rating)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.dr}
                onChange={(e) => setFormData({ ...formData, dr: parseInt(e.target.value) || 0 })}
                data-testid="domain-dr-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              />
            </div>

            {/* DA */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                DA (Domain Authority)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.da}
                onChange={(e) => setFormData({ ...formData, da: parseInt(e.target.value) || 0 })}
                data-testid="domain-da-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              />
            </div>

            {/* PA */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                PA (Page Authority)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.pa}
                onChange={(e) => setFormData({ ...formData, pa: parseInt(e.target.value) || 0 })}
                data-testid="domain-pa-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              />
            </div>

            {/* UR */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                UR (URL Rating)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.ur}
                onChange={(e) => setFormData({ ...formData, ur: parseInt(e.target.value) || 0 })}
                data-testid="domain-ur-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              />
            </div>

            {/* TF */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                TF (Trust Flow)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.tf}
                onChange={(e) => setFormData({ ...formData, tf: parseInt(e.target.value) || 0 })}
                data-testid="domain-tf-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              />
            </div>

            {/* CF */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                CF (Citation Flow)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.cf}
                onChange={(e) => setFormData({ ...formData, cf: parseInt(e.target.value) || 0 })}
                data-testid="domain-cf-input"
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
              data-testid="domain-notes-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-3 text-white"
              rows="3"
              placeholder="Catatan internal tentang domain ini..."
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
            data-testid="domain-submit-button"
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
                {domain ? 'Update' : 'Simpan'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DomainForm;