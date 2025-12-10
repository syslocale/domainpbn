import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { blogAPI } from '../../api/client';
import { toast } from 'sonner';

const BlogForm = ({ post, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    meta_title: '',
    meta_description: '',
    is_published: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        thumbnail: post.thumbnail || '',
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        is_published: post.is_published ?? true,
      });
    }
  }, [post]);

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
      slug: generateSlug(title),
      meta_title: title,
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
      if (post) {
        await blogAPI.update(post.id, formData);
        toast.success('Blog post berhasil diupdate');
      } else {
        await blogAPI.create(formData);
        toast.success('Blog post berhasil dibuat');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Gagal menyimpan blog post');
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
      ['link', 'image'],
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
    'image',
  ];

  return (
    <div data-testid="blog-form">
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
              {post ? 'Edit Blog Post' : 'Tambah Blog Post'}
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
              data-testid="blog-title-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              placeholder="Masukkan judul blog post"
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
              data-testid="blog-slug-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              placeholder="url-friendly-slug"
              required
            />
            <p className="text-xs text-slate-500 mt-1">URL: /blog/{formData.slug}</p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              data-testid="blog-excerpt-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-3 text-white"
              rows="3"
              placeholder="Ringkasan singkat artikel (untuk preview)"
            />
          </div>

          {/* Content - Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Content <span className="text-red-400">*</span>
            </label>
            <div className="bg-white rounded-lg" data-testid="blog-content-editor">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                modules={modules}
                formats={formats}
                style={{ height: '400px', marginBottom: '50px' }}
              />
            </div>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Thumbnail URL
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              data-testid="blog-thumbnail-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              placeholder="https://example.com/image.jpg"
            />
            {formData.thumbnail && (
              <img
                src={formData.thumbnail}
                alt="Thumbnail preview"
                className="mt-3 w-32 h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>
        </div>

        {/* SEO Section */}
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-xl font-semibold text-white">SEO Settings</h3>

          {/* Meta Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              data-testid="blog-meta-title-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-12 px-4 text-white"
              placeholder="SEO meta title (60-70 karakter)"
            />
            <p className="text-xs text-slate-500 mt-1">{formData.meta_title.length} / 70 karakter</p>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              data-testid="blog-meta-desc-input"
              className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-3 text-white"
              rows="3"
              placeholder="SEO meta description (150-160 karakter)"
            />
            <p className="text-xs text-slate-500 mt-1">{formData.meta_description.length} / 160 karakter</p>
          </div>

          {/* Published Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              data-testid="blog-published-checkbox"
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
            data-testid="blog-submit-button"
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
                {post ? 'Update' : 'Simpan'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
