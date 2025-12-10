import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { pbnAPI } from '../../api/client';
import { formatIDR } from '../../utils/format';
import { toast } from 'sonner';
import PBNForm from '../../components/admin/PBNForm';
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

const PBNManagement = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setLoading(true);
      const response = await pbnAPI.getAll();
      setSites(response.data);
    } catch (error) {
      console.error('Error fetching sites:', error);
      toast.error('Gagal memuat PBN sites');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSite(null);
    setShowForm(true);
  };

  const handleEdit = (site) => {
    setEditingSite(site);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await pbnAPI.delete(deleteId);
      toast.success('PBN site berhasil dihapus');
      fetchSites();
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting site:', error);
      toast.error('Gagal menghapus PBN site');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSite(null);
    fetchSites();
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
      <PBNForm
        site={editingSite}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingSite(null);
        }}
      />
    );
  }

  return (
    <div data-testid="pbn-management">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">PBN Sites Management</h1>
          <p className="text-slate-400">Manage semua PBN sites dalam network Anda</p>
        </div>
        <button
          onClick={handleCreate}
          data-testid="create-pbn-button"
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-6 py-3 font-medium transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah PBN Site
        </button>
      </div>

      {/* PBN Sites Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4 text-slate-300 font-semibold">Code</th>
                <th className="text-left px-6 py-4 text-slate-300 font-semibold">Domain</th>
                <th className="text-left px-6 py-4 text-slate-300 font-semibold">Niche</th>
                <th className="text-center px-6 py-4 text-slate-300 font-semibold">DR/DA</th>
                <th className="text-center px-6 py-4 text-slate-300 font-semibold">Traffic</th>
                <th className="text-center px-6 py-4 text-slate-300 font-semibold">Price</th>
                <th className="text-center px-6 py-4 text-slate-300 font-semibold">Status</th>
                <th className="text-right px-6 py-4 text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sites.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-400">
                    Belum ada PBN site. Klik "Tambah PBN Site" untuk membuat yang pertama.
                  </td>
                </tr>
              ) : (
                sites.map((site, index) => (
                  <tr key={site.id} data-testid={`pbn-row-${index}`} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-blue-400 font-semibold">{site.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white text-sm">{site.domain_real}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 bg-slate-800 rounded text-slate-300 text-xs">
                        {site.niche}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-white font-semibold">{site.dr} / {site.da}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-300">
                      {site.traffic.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center text-blue-400 font-medium">
                      {formatIDR(site.price_per_post)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          site.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {site.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(site)}
                          data-testid={`edit-pbn-${index}`}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(site.id)}
                          data-testid={`delete-pbn-${index}`}
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
            <AlertDialogTitle className="text-white">Hapus PBN Site?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Apakah Anda yakin ingin menghapus PBN site ini? Tindakan ini tidak dapat dibatalkan.
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

export default PBNManagement;