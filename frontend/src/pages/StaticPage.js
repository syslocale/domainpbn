import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pagesAPI } from '../api/client';
import SEOHead from '../components/SEOHead';

const StaticPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const response = await pagesAPI.getBySlug(slug);
        setPage(response.data);
      } catch (error) {
        console.error('Error fetching page:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Halaman Tidak Ditemukan</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="static-page">
      <SEOHead
        title={`${page.title} - DomainPBN`}
        description={`${page.title} - DomainPBN Premium Backlinks Service`}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="glass-panel p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-8">
            {page.title}
          </h1>

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
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>

        {/* CTA */}
        <div className="mt-12 glass-panel p-8 md:p-12 text-center">
          <h3 className="text-2xl font-semibold text-white mb-4">
            Tertarik dengan Layanan Kami?
          </h3>
          <p className="text-slate-300 mb-6">
            Lihat paket backlink PBN premium kami atau hubungi tim untuk konsultasi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/paket"
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 py-3 font-medium transition-all inline-block"
            >
              Lihat Paket
            </Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-500 text-white rounded-full px-8 py-3 font-medium transition-all inline-block"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticPage;