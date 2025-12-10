import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { packagesAPI } from '../../api/client';
import { formatIDR } from '../../utils/format';
import { toast } from 'sonner';
import PackageForm from '../../components/admin/PackageForm';
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

const PackagesManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await packagesAPI.getAll();
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Gagal memuat packages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPackage(null);
    setShowForm(true);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await packagesAPI.delete(deleteId);
      toast.success('Package berhasil dihapus');
      fetchPackages();
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Gagal menghapus package');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPackage(null);
    fetchPackages();
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
      <PackageForm
        package={editingPackage}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingPackage(null);
        }}
      />
    );
  }

  return (
    <div data-testid="packages-management">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Packages Management</h1>
          <p className="text-slate-400">Manage paket backlink dan pricing</p>
        </div>
        <button
          onClick={handleCreate}
          data-testid="create-package-button"
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-6 py-3 font-medium transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah Package
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length === 0 ? (
          <div className="col-span-full glass-panel p-8 text-center text-slate-400">
            Belum ada package. Klik "Tambah Package" untuk membuat yang pertama.
          </div>
        ) : (
          packages.map((pkg, index) => (
            <div
              key={pkg.id}
              data-testid={`package-row-${index}`}
              className={`glass-panel p-6 card-hover ${
                pkg.is_popular ? 'border-2 border-blue-500/50' : ''
              }`}
            >
              {pkg.is_popular && (
                <div className="mb-3">
                  <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    POPULER
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-semibold text-white mb-2">{pkg.name}</h3>
              <div className="text-3xl font-bold text-blue-400 mb-2">{formatIDR(pkg.price)}</div>
              <p className="text-slate-400 text-sm mb-4">{pkg.backlink_count} Backlinks</p>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">{pkg.description}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  pkg.is_active ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {pkg.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-slate-500 text-xs">Sort: {pkg.sort_order}</span>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleEdit(pkg)}
                  data-testid={`edit-package-${index}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(pkg.id)}
                  data-testid={`delete-package-${index}`}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-900 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Hapus Package?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Apakah Anda yakin ingin menghapus package ini? Tindakan ini tidak dapat dibatalkan.
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

export default PackagesManagement;