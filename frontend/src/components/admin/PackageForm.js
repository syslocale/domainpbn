import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { packagesAPI } from '../../api/client';
import { toast } from 'sonner';

const PackageForm = ({ package: pkg, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    backlink_count: 0,
    price: 0,
    description: '',
    is_popular: false,
    sort_order: 0,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name || '',
        slug: pkg.slug || '',
        backlink_count: pkg.backlink_count || 0,
        price: pkg.price || 0,
        description: pkg.description || '',
        is_popular: pkg.is_popular || false,
        sort_order: pkg.sort_order || 0,
        is_active: pkg.is_active ?? true,
      });
    }
  }, [pkg]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: pkg ? formData.slug : generateSlug(name),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug) {
      toast.error('Name dan slug wajib diisi');
      return;
    }

    try {
      setLoading(true);
      if (pkg) {
        await packagesAPI.update(pkg.id, formData);
        toast.success('Package berhasil diupdate');
      } else {
        await packagesAPI.create(formData);
        toast.success('Package berhasil dibuat');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error('Gagal menyimpan package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="package-form">
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
              {pkg ? 'Edit Package' : 'Tambah Package'}
            </h1>
            <p className="text-slate-400">Manage paket backlink dan pricing</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-xl font-semibold text-white">Package Information</h3>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Package Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              data-testid="package-name-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              placeholder="Paket Starter, Professional, Enterprise"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Slug <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              data-testid="package-slug-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              placeholder="paket-starter"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Backlink Count */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Jumlah Backlink
              </label>
              <input
                type="number"
                min="0"
                value={formData.backlink_count}
                onChange={(e) => setFormData({ ...formData, backlink_count: parseInt(e.target.value) || 0 })}
                data-testid="package-count-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Harga (IDR)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                data-testid="package-price-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              data-testid="package-desc-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-3 text-white"
              rows="4"
              placeholder="Deskripsi lengkap tentang paket ini..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Sort Order
              </label>
              <input
                type="number"
                min="0"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                data-testid="package-sort-input"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              />
              <p className="text-xs text-slate-500 mt-1">Urutan tampil di frontend (ascending)</p>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_popular"
                checked={formData.is_popular}
                onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                data-testid="package-popular-checkbox"
                className="w-5 h-5 rounded border-white/10 bg-slate-950/50 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_popular" className="text-slate-300 cursor-pointer">
                Tandai sebagai paket populer
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                data-testid="package-active-checkbox"
                className="w-5 h-5 rounded border-white/10 bg-slate-950/50 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-slate-300 cursor-pointer">
                Aktifkan paket (tampilkan di frontend)
              </label>
            </div>
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
            data-testid="package-submit-button"
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
                {pkg ? 'Update' : 'Simpan'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PackageForm;