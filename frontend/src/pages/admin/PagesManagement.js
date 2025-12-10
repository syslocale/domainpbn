import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { pagesAPI } from '../../api/client';
import { toast } from 'sonner';
import PageForm from '../../components/admin/PageForm';
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

const PagesManagement = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await pagesAPI.getAll();
      setPages(response.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error('Gagal memuat pages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPage(null);
    setShowForm(true);
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await pagesAPI.delete(deleteId);
      toast.success('Page berhasil dihapus');
      fetchPages();
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Gagal menghapus page');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPage(null);
    fetchPages();
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
      <PageForm
        page={editingPage}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingPage(null);
        }}
      />
    );
  }

  return (
    <div data-testid="pages-management">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pages Management</h1>
          <p className="text-slate-400">Manage static pages (About, TOS, Privacy, dll)</p>
        </div>
        <button
          onClick={handleCreate}
          data-testid="create-page-button"
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-6 py-3 font-medium transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah Page
        </button>
      </div>

      {/* Pages Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4 text-slate-300 font-semibold">Title</th>
                <th className="text-left px-6 py-4 text-slate-300 font-semibold">Slug</th>
                <th className="text-left px-6 py-4 text-slate-300 font-semibold">Status</th>
                <th className="text-right px-6 py-4 text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pages.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                    Belum ada pages. Klik "Tambah Page" untuk membuat yang pertama.
                  </td>
                </tr>
              ) : (
                pages.map((page, index) => (
                  <tr key={page.id} data-testid={`page-row-${index}`} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{page.title}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">/{page.slug}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          page.is_published
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {page.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                          title="View"
                        >
                          <Eye size={18} />
                        </a>
                        <button
                          onClick={() => handleEdit(page)}
                          data-testid={`edit-page-${index}`}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(page.id)}
                          data-testid={`delete-page-${index}`}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-900 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Hapus Page?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Apakah Anda yakin ingin menghapus page ini? Tindakan ini tidak dapat dibatalkan.
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

export default PagesManagement;