import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { faqAPI } from '../../api/client';
import { toast } from 'sonner';

const FAQForm = ({ faq, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    sort_order: 0,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question || '',
        answer: faq.answer || '',
        sort_order: faq.sort_order || 0,
        is_active: faq.is_active ?? true,
      });
    }
  }, [faq]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.question || !formData.answer) {
      toast.error('Question dan answer wajib diisi');
      return;
    }

    try {
      setLoading(true);
      if (faq) {
        await faqAPI.update(faq.id, formData);
        toast.success('FAQ berhasil diupdate');
      } else {
        await faqAPI.create(formData);
        toast.success('FAQ berhasil dibuat');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('Gagal menyimpan FAQ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="faq-form">
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
              {faq ? 'Edit FAQ' : 'Tambah FAQ'}
            </h1>
            <p className="text-slate-400">Manage pertanyaan yang sering ditanyakan</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel p-6 space-y-6">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Question <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              data-testid="faq-question-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              placeholder="Pertanyaan yang sering ditanyakan..."
              required
            />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Answer <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              data-testid="faq-answer-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-3 text-white"
              rows="6"
              placeholder="Jawaban lengkap untuk pertanyaan ini..."
              required
            />
          </div>

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
              data-testid="faq-sort-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
            />
            <p className="text-xs text-slate-500 mt-1">Urutan tampil di frontend (ascending)</p>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              data-testid="faq-active-checkbox"
              className="w-5 h-5 rounded border-white/10 bg-slate-950/50 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-slate-300 cursor-pointer">
              Aktifkan FAQ (tampilkan di frontend)
            </label>
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
            data-testid="faq-submit-button"
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
                {faq ? 'Update' : 'Simpan'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FAQForm;