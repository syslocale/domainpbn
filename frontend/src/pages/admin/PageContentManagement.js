import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, AlertCircle } from 'lucide-react';
import { pageContentAPI } from '../../api/client';

const PageContentManagement = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await pageContentAPI.getAllAdmin();
      setContents(response.data);
    } catch (error) {
      console.error('Error fetching page contents:', error);
      setError('Gagal mengambil data page content');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (content) => {
    setEditingId(content.id);
    setEditForm({
      id: content.id,
      content: { ...content.content }
    });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setError('');
  };

  const handleContentFieldChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      await pageContentAPI.update(editForm.id, {
        content: editForm.content
      });
      
      setSuccess('Content berhasil diupdate!');
      setEditingId(null);
      setEditForm({});
      
      // Refresh data
      await fetchContents();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating content:', error);
      setError('Gagal mengupdate content. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Page Content Management</h1>
          <p className="text-slate-400">
            Edit teks dan konten statis di halaman-halaman website
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="text-green-400" size={20} />
            <span className="text-green-400">{success}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="text-red-400" size={20} />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Content List */}
        <div className="space-y-6">
          {contents.map((content) => (
            <div
              key={content.id}
              className="glass-panel p-6 rounded-lg border border-white/10"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-blue-400">
                    {content.section}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Key: <code className="text-slate-400">{content.page_key}</code>
                  </p>
                </div>
                {editingId !== content.id && (
                  <button
                    onClick={() => handleEdit(content)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                )}
              </div>

              {/* Content Fields */}
              {editingId === content.id ? (
                <div className="space-y-4">
                  {Object.entries(editForm.content).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-slate-300 mb-2 capitalize">
                        {key.replace(/_/g, ' ')}
                      </label>
                      <textarea
                        value={value}
                        onChange={(e) => handleContentFieldChange(key, e.target.value)}
                        rows={3}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  ))}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      <Save size={16} />
                      {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      <X size={16} />
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(content.content).map(([key, value]) => (
                    <div key={key} className="bg-slate-900/30 rounded p-3">
                      <div className="text-xs text-slate-500 mb-1 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </div>
                      <div className="text-slate-200">{value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="font-semibold text-blue-400 mb-2">💡 Cara Menggunakan:</h4>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Klik tombol "Edit" pada section yang ingin diubah</li>
            <li>• Edit teks sesuai kebutuhan Anda</li>
            <li>• Klik "Simpan" untuk menyimpan perubahan</li>
            <li>• Perubahan akan langsung terlihat di website</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PageContentManagement;
