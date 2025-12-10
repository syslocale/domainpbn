import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { faqAPI } from '../../api/client';
import { toast } from 'sonner';
import FAQForm from '../../components/admin/FAQForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await faqAPI.getAll();
      setFaqs(response.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Gagal memuat FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingFaq(null);
    setShowForm(true);
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await faqAPI.delete(deleteId);
      toast.success('FAQ berhasil dihapus');
      fetchFaqs();
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Gagal menghapus FAQ');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingFaq(null);
    fetchFaqs();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (showForm) {
    return (
      <FAQForm
        faq={editingFaq}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingFaq(null);
        }}
      />
    );
  }

  return (
    <div data-testid="faq-management">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">FAQ Management</h1>
          <p className="text-slate-400">Manage pertanyaan yang sering ditanyakan</p>
        </div>
        <button
          onClick={handleCreate}
          data-testid="create-faq-button"
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-6 py-3 font-medium transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah FAQ
        </button>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-400">
            Belum ada FAQ. Klik "Tambah FAQ" untuk membuat yang pertama.
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div
              key={faq.id}
              data-testid={`faq-row-${index}`}
              className="glass-panel p-6 hover:bg-slate-900/50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      faq.is_active ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {faq.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-slate-500 text-xs">Sort: {faq.sort_order}</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{faq.answer}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(faq)}
                    data-testid={`edit-faq-${index}`}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteId(faq.id)}
                    data-testid={`delete-faq-${index}`}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-900 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Hapus FAQ?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Apakah Anda yakin ingin menghapus FAQ ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FAQManagement;