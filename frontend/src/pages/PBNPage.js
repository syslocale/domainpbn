import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageCircle } from 'lucide-react';
import { pbnAPI, settingsAPI } from '../api/client';
import { generateCustomPBNMessage, getWhatsAppURL } from '../utils/whatsapp';
import { formatIDR, formatNumber } from '../utils/format';
import SEOHead from '../components/SEOHead';

const PBNPage = () => {
  const [pbnSites, setPbnSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    niche: '',
    minDR: '',
    sortBy: 'dr',
  });
  
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pbnRes, settingsRes] = await Promise.all([
          pbnAPI.getPublic({ sort_by: 'dr', limit: 100 }),
          settingsAPI.get(),
        ]);
        setPbnSites(pbnRes.data);
        setFilteredSites(pbnRes.data);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...pbnSites];

    // Filter by niche
    if (filters.niche) {
      filtered = filtered.filter((site) =>
        site.niche.toLowerCase().includes(filters.niche.toLowerCase())
      );
    }

    // Filter by min DR
    if (filters.minDR) {
      filtered = filtered.filter((site) => site.dr >= parseInt(filters.minDR));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'dr':
          return b.dr - a.dr;
        case 'da':
          return b.da - a.da;
        case 'traffic':
          return b.traffic - a.traffic;
        case 'price_asc':
          return a.price_per_post - b.price_per_post;
        case 'price_desc':
          return b.price_per_post - a.price_per_post;
        default:
          return 0;
      }
    });

    setFilteredSites(filtered);
    setPage(1); // Reset to page 1 when filters change
  }, [filters, pbnSites]);

  const handleOrderClick = (site) => {
    if (!settings) return;
    const message = generateCustomPBNMessage(site.code);
    const url = getWhatsAppURL(settings.whatsapp_number, message);
    window.open(url, '_blank');
  };

  const uniqueNiches = [...new Set(pbnSites.map((site) => site.niche))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="pbn-page">
      <SEOHead
        title="PBN Network - Daftar Domain PBN Premium | DomainPBN"
        description="Lihat list PBN network kami dengan metrics transparan: DR, DA, Traffic, Spam Score. Domain aged berkualitas tinggi untuk backlink yang powerful."
        keywords="pbn network, daftar pbn, domain pbn, metrics pbn, dr da pbn"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <span className="text-blue-400 text-sm font-medium">PBN NETWORK</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 text-white">
            <span className="text-blue-400">PBN Network</span> Kami
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Transparansi penuh! Lihat metrics semua PBN kami sebelum order.
            Domain aged dengan authority tinggi dan spam score rendah.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-panel p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Niche Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Filter by Niche
              </label>
              <select
                value={filters.niche}
                onChange={(e) => setFilters({ ...filters, niche: e.target.value })}
                data-testid="filter-niche"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-10 px-4 text-white"
              >
                <option value="">All Niches</option>
                {uniqueNiches.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>
            </div>

            {/* Min DR Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Min Domain Rating
              </label>
              <select
                value={filters.minDR}
                onChange={(e) => setFilters({ ...filters, minDR: e.target.value })}
                data-testid="filter-min-dr"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-10 px-4 text-white"
              >
                <option value="">All DR</option>
                <option value="40">40+</option>
                <option value="50">50+</option>
                <option value="60">60+</option>
                <option value="70">70+</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                data-testid="filter-sort"
                className="w-full bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg h-10 px-4 text-white"
              >
                <option value="dr">DR (Highest)</option>
                <option value="da">DA (Highest)</option>
                <option value="traffic">Traffic (Highest)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="w-full bg-blue-600/20 border border-blue-500/30 rounded-lg h-10 px-4 flex items-center">
                <span className="text-blue-400 font-medium">
                  {filteredSites.length} PBN Sites
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PBN Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredSites.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((site, index) => (
            <div
              key={site.id}
              data-testid={`pbn-item-${index}`}
              className="glass-panel p-6 hover:bg-slate-900/50 transition-all card-hover"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-blue-400 font-semibold text-xl mb-1">{site.code}</div>
                  <div className="inline-block px-2 py-1 bg-slate-800 rounded text-slate-300 text-xs">
                    {site.niche}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{site.dr}</div>
                  <div className="text-xs text-slate-500">DR</div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-white/10">
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{site.da}</div>
                  <div className="text-xs text-slate-500">DA</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{formatNumber(site.traffic)}</div>
                  <div className="text-xs text-slate-500">Traffic</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{site.age}y</div>
                  <div className="text-xs text-slate-500">Age</div>
                </div>
              </div>

              {/* Spam Score Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Spam Score:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      site.spam_score < 1
                        ? 'bg-green-500/20 text-green-400'
                        : site.spam_score < 2
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {site.spam_score}%
                  </span>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Harga per post</div>
                  <div className="text-blue-400 font-bold text-lg">{formatIDR(site.price_per_post)}</div>
                </div>
                <button
                  onClick={() => handleOrderClick(site)}
                  data-testid={`pbn-order-${index}`}
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all"
                >
                  Order
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filteredSites.length > ITEMS_PER_PAGE && (
          <div className="mb-12 flex justify-center items-center gap-4">
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
              Halaman <span className="text-white font-semibold">{page}</span> dari <span className="text-white font-semibold">{Math.ceil(filteredSites.length / ITEMS_PER_PAGE)}</span>
            </div>
            {page < Math.ceil(filteredSites.length / ITEMS_PER_PAGE) && (
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

        {/* CTA Section */}
        <div className="glass-panel p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Butuh Paket Custom?
          </h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Ingin pilih PBN sendiri atau butuh jumlah backlink khusus?
            Hubungi kami untuk paket custom sesuai kebutuhan Anda!
          </p>
          <button
            onClick={() => {
              if (settings) {
                const message = generateCustomPBNMessage();
                const url = getWhatsAppURL(settings.whatsapp_number, message);
                window.open(url, '_blank');
              }
            }}
            data-testid="custom-order-button"
            className="bg-green-600 hover:bg-green-500 text-white rounded-full px-8 py-3 font-medium transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            <MessageCircle size={20} />
            Chat untuk Paket Custom
          </button>
        </div>
      </div>
    </div>
  );
};

export default PBNPage;