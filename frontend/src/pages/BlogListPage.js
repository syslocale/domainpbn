import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ArrowRight } from 'lucide-react';
import { blogAPI } from '../api/client';
import { formatDate } from '../utils/format';
import SEOHead from '../components/SEOHead';

const BlogListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await blogAPI.getList({ search: searchQuery, page, limit: 9 });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [searchQuery, page]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setPage(1);
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="blog-list-page">
      <SEOHead
        title="Blog SEO & PBN - Tips dan Panduan Backlink | DomainPBN"
        description="Artikel dan panduan lengkap tentang SEO, backlink PBN, dan strategi meningkatkan ranking website. Update terbaru dari expert SEO Indonesia."
        keywords="blog seo, panduan backlink, tips pbn, artikel seo indonesia"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <span className="text-blue-400 text-sm font-medium">BLOG & RESOURCES</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 text-white">
            Blog <span className="text-blue-400">SEO</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Tips, panduan, dan strategi SEO untuk memaksimalkan hasil backlink PBN Anda
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel..."
                data-testid="blog-search-input"
                className="w-full bg-slate-950/50 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-full h-12 pl-12 pr-4 text-white placeholder:text-slate-500"
              />
            </div>
          </form>
        </div>

        {/* Blog Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">Tidak ada artikel ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                data-testid={`blog-item-${index}`}
                className="glass-panel overflow-hidden card-hover group flex flex-col"
              >
                {/* Thumbnail */}
                {post.thumbnail && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                    <Calendar size={14} />
                    <span>{formatDate(post.published_at)}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-blue-400 font-medium text-sm group-hover:gap-3 transition-all">
                    Baca Selengkapnya
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {(page > 1 || posts.length === 9) && (
          <div className="mt-12 flex justify-center items-center gap-4">
            {page > 1 && (
              <button
                onClick={() => setPage(page - 1)}
                data-testid="prev-page-btn"
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-6 py-2 font-medium transition-all"
              >
                Previous
              </button>
            )}
            <div className="text-slate-400 px-4">
              Halaman <span className="text-white font-semibold">{page}</span>
            </div>
            {posts.length === 9 && (
              <button
                onClick={() => setPage(page + 1)}
                data-testid="next-page-btn"
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-6 py-2 font-medium transition-all"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;