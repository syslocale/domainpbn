import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { blogAPI } from '../../api/client';
import { formatDate } from '../../utils/format';
import { toast } from 'sonner';
import BlogForm from '../../components/admin/BlogForm';
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

const BlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAll();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Gagal memuat blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await blogAPI.delete(deleteId);
      toast.success('Blog post berhasil dihapus');
      fetchPosts();
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Gagal menghapus blog post');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPost(null);
    fetchPosts();
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
      <BlogForm
        post={editingPost}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingPost(null);
        }}
      />
    );
  }

  return (
    <div data-testid="blog-management">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Blog Management</h1>
          <p className="text-slate-400">Manage blog posts dengan Rich Text Editor</p>
        </div>
        <button
          onClick={handleCreate}
          data-testid="create-blog-button"
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-6 py-3 font-medium transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah Blog Post
        </button>
      </div>

      {/* Blog Posts Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4 text-slate-300 font-semibold">Title</th>
                <th className="text-left px-6 py-4 text-slate-300 font-semibold">Slug</th>
                <th className="text-left px-6 py-4 text-slate-300 font-semibold">Status</th>
                <th className="text-left px-6 py-4 text-slate-300 font-semibold">Published</th>
                <th className="text-right px-6 py-4 text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    Belum ada blog post. Klik "Tambah Blog Post" untuk membuat yang pertama.
                  </td>
                </tr>
              ) : (
                posts.map((post, index) => (
                  <tr key={post.id} data-testid={`blog-row-${index}`} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{post.title}</div>
                      <div className="text-slate-400 text-sm mt-1">{post.excerpt.substring(0, 60)}...</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{post.slug}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          post.is_published
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {post.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">
                      {formatDate(post.published_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                          title="View"
                        >
                          <Eye size={18} />
                        </a>
                        <button
                          onClick={() => handleEdit(post)}
                          data-testid={`edit-blog-${index}`}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(post.id)}
                          data-testid={`delete-blog-${index}`}
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
            <AlertDialogTitle className="text-white">Hapus Blog Post?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Apakah Anda yakin ingin menghapus blog post ini? Tindakan ini tidak dapat dibatalkan.
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

export default BlogManagement;