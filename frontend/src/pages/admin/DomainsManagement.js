import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, Download } from 'lucide-react';
import { domainsAPI } from '../../api/client';
import { formatIDR } from '../../utils/format';
import { toast } from 'sonner';
import DomainForm from '../../components/admin/DomainForm';
import DomainImport from '../../components/admin/DomainImport';
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

const DomainsManagement = () => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const response = await domainsAPI.getAll();
      setDomains(response.data);
    } catch (error) {
      console.error('Error fetching domains:', error);
      toast.error('Gagal memuat domains');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingDomain(null);
    setShowForm(true);
  };

  const handleImport = () => {
    setShowImport(true);
  };

  const handleEdit = (domain) => {
    setEditingDomain(domain);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await domainsAPI.delete(deleteId);
      toast.success('Domain berhasil dihapus');
      fetchDomains();
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting domain:', error);
      toast.error('Gagal menghapus domain');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingDomain(null);
    fetchDomains();
  };

  const handleImportSuccess = () => {
    setShowImport(false);
    fetchDomains();
  };

  const downloadTemplate = () => {
    // Create CSV template
    const headers = ['domain_name', 'da', 'pa', 'ur', 'dr', 'tf', 'cf', 'price', 'age', 'registrar', 'web_archive_history', 'status', 'notes'];
    const exampleRow = ['example.com', '50', '45', '40', '55', '30', '35', '5000000', '8', 'GoDaddy', 'https://web.archive.org/web/*/example.com', 'available', 'High quality domain'];
    
    const csv = [headers.join(','), exampleRow.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'domain_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded');
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
      <DomainForm
        domain={editingDomain}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingDomain(null);
        }}
      />
    );
  }

  if (showImport) {
    return (
      <DomainImport
        onSuccess={handleImportSuccess}
        onCancel={() => setShowImport(false)}
      />
    );
  }

  return (
    <div data-testid="domains-management">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Aged Domains Management</h1>
          <p className="text-slate-400">Manage aged/expired domains untuk dijual</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadTemplate}
            className="bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-4 py-2.5 font-medium transition-all flex items-center gap-2"
          >
            <Download size={18} />
            Template
          </button>
          <button
            onClick={handleImport}
            data-testid="import-domains-button"
            className="bg-green-600 hover:bg-green-500 text-white rounded-lg px-6 py-3 font-medium transition-all flex items-center gap-2"
          >
            <Upload size={20} />
            Import CSV/Excel
          </button>
          <button
            onClick={handleCreate}
            data-testid="create-domain-button"
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-6 py-3 font-medium transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Tambah Domain
          </button>
        </div>
      </div>

      {/* Domains Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4 text-slate-300 font-semibold">Domain</th>
                <th className="text-center px-6 py-4 text-slate-300 font-semibold">DR/DA</th>
                <th className="text-center px-6 py-4 text-slate-300 font-semibold">PA/UR</th>
                <th className="text-center px-6 py-4 text-slate-300 font-semibold">TF/CF</th>
                <th className="text-center px-6 py-4 text-slate-300 font-semibold">Age</th>
                <th className="text-center px-6 py-4 text-slate-300 font-semibold">Price</th>
                <th className="text-center px-6 py-4 text-slate-300 font-semibold">Status</th>
                <th className="text-right px-6 py-4 text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {domains.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-400">
                    Belum ada domain. Klik "Tambah Domain" atau "Import CSV/Excel" untuk mulai.
                  </td>
                </tr>
              ) : (
                domains.map((domain, index) => (
                  <tr key={domain.id} data-testid={`domain-row-${index}`} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-blue-400 font-semibold break-all">{domain.domain_name}</div>
                      <div className="text-slate-400 text-xs mt-1">{domain.registrar}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-white font-semibold">{domain.dr} / {domain.da}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-white font-semibold">{domain.pa} / {domain.ur}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-white font-semibold">{domain.tf} / {domain.cf}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-300">
                      {domain.age}y
                    </td>
                    <td className="px-6 py-4 text-center text-blue-400 font-medium">
                      {formatIDR(domain.price)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          domain.status === 'available'
                            ? 'bg-green-500/20 text-green-400'
                            : domain.status === 'sold'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {domain.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(domain)}
                          data-testid={`edit-domain-${index}`}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(domain.id)}
                          data-testid={`delete-domain-${index}`}
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
            <AlertDialogTitle className="text-white">Hapus Domain?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Apakah Anda yakin ingin menghapus domain ini? Tindakan ini tidak dapat dibatalkan.
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

export default DomainsManagement;
