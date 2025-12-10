import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { pagesAPI } from '../../api/client';
import { toast } from 'sonner';

const PageForm = ({ page, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    is_published: true,
  });
  const [loading, setLoading] = useState(false);
  const [ReactQuill, setReactQuill] = useState(null);
  const quillRef = useRef(null);

  // Dynamically import ReactQuill to avoid SSR issues with React 19
  useEffect(() => {
    import('react-quill').then((module) => {
      setReactQuill(() => module.default);
    });
    import('react-quill/dist/quill.snow.css');
  }, []);

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        content: page.content || '',
        is_published: page.is_published ?? true,
      });
    }
  }, [page]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: page ? formData.slug : generateSlug(title), // Don't auto-update slug when editing
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error('Title, slug, dan content wajib diisi');
      return;
    }

    try {
      setLoading(true);
      if (page) {
        await pagesAPI.update(page.id, formData);
        toast.success('Page berhasil diupdate');
      } else {
        await pagesAPI.create(formData);
        toast.success('Page berhasil dibuat');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Gagal menyimpan page');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'color',
    'background',
    'link',
  ];

  return (
    <div data-testid="page-form">
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
              {page ? 'Edit Page' : 'Tambah Page'}
            </h1>
            <p className="text-slate-400">Gunakan Rich Text Editor untuk format konten</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              data-testid="page-title-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              placeholder="Masukkan judul page"
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
              data-testid="page-slug-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              placeholder="url-friendly-slug"
              required
            />
            <p className="text-xs text-slate-500 mt-1">URL: /{formData.slug}</p>
          </div>

          {/* Content - Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Content <span className="text-red-400">*</span>
            </label>
            <div className="bg-white rounded-lg" data-testid="page-content-editor">
              {ReactQuill ? (
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  modules={modules}
                  formats={formats}
                  style={{ height: '500px', marginBottom: '50px' }}
                />
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>

          {/* Published Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              data-testid="page-published-checkbox"
              className="w-5 h-5 rounded border-white/10 bg-slate-950/50 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_published" className="text-slate-300 cursor-pointer">
              Publish immediately
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
            data-testid="page-submit-button"
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
                {page ? 'Update' : 'Simpan'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageForm;