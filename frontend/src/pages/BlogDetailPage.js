import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { blogAPI } from '../api/client';
import { formatDate } from '../utils/format';
import { updateMetaTags, generateArticleSchema, addStructuredData, removeStructuredData } from '../utils/seo';
import SEOHead from '../components/SEOHead';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [structuredDataScript, setStructuredDataScript] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await blogAPI.getBySlug(slug);
        setPost(response.data);

        // Add structured data
        const schema = generateArticleSchema(response.data);
        const script = addStructuredData(schema);
        setStructuredDataScript(script);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();

    // Cleanup structured data on unmount
    return () => {
      if (structuredDataScript) {
        removeStructuredData(structuredDataScript);
      }
    };
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Artikel Tidak Ditemukan</h1>
          <Link to="/blog" className="text-blue-400 hover:text-blue-300">
            Kembali ke Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="blog-detail-page">
      <SEOHead
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        keywords={post.keywords || 'seo, backlink, pbn'}
        ogImage={post.thumbnail}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Blog
        </Link>

        {/* Article Header */}
        <article className="glass-panel p-8 md:p-12">
          {/* Meta */}
          <div className="flex items-center gap-4 text-slate-400 text-sm mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 hover:text-blue-400 transition-colors"
              aria-label="Share article"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">{post.excerpt}</p>

          {/* Thumbnail */}
          {post.thumbnail && (
            <div className="aspect-video rounded-xl overflow-hidden mb-8">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-invert prose-slate max-w-none
              prose-headings:text-white prose-headings:font-semibold
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
              prose-ul:text-slate-300 prose-ul:my-4
              prose-li:mb-2
              prose-strong:text-white prose-strong:font-semibold
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* CTA */}
        <div className="mt-12 glass-panel p-8 md:p-12 text-center">
          <h3 className="text-2xl font-semibold text-white mb-4">
            Siap Meningkatkan Ranking Website Anda?
          </h3>
          <p className="text-slate-300 mb-6">
            Dapatkan backlink PBN berkualitas tinggi dengan harga terjangkau
          </p>
          <Link
            to="/paket"
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 py-3 font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] inline-block"
          >
            Lihat Paket Backlink
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;