import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageCircle, ExternalLink } from 'lucide-react';
import { domainsAPI, settingsAPI } from '../api/client';
import { generateCustomPBNMessage, getWhatsAppURL } from '../utils/whatsapp';
import { formatIDR } from '../utils/format';
import SEOHead from '../components/SEOHead';

const DomainsPage = () => {
  const [domains, setDomains] = useState([]);
  const [filteredDomains, setFilteredDomains] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    minDR: '',
    sortBy: 'dr',
  });
  
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [domainsRes, settingsRes] = await Promise.all([
          domainsAPI.getPublic({ sort_by: 'dr', limit: 100 }),
          settingsAPI.get(),
        ]);
        setDomains(domainsRes.data);
        setFilteredDomains(domainsRes.data);
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
    let filtered = [...domains];

    // Filter by min DR
    if (filters.minDR) {
      filtered = filtered.filter((domain) => domain.dr >= parseInt(filters.minDR));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'dr':
          return b.dr - a.dr;
        case 'da':
          return b.da - a.da;
        case 'age':
          return b.age - a.age;
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredDomains(filtered);
    setPage(1); // Reset to page 1 when filters change
  }, [filters, domains]);

  const handleOrderClick = (domain) => {
    if (!settings) return;
    const message = `Halo admin DomainPBN! Saya tertarik dengan domain: ${domain.domain_name}. Mohon info lebih lanjut.`;
    const url = getWhatsAppURL(settings.whatsapp_number, encodeURIComponent(message));
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="domains-page">
      <SEOHead
        title="Aged Domain for Sale - Premium Expired Domains | DomainPBN"
        description="Beli aged domain berkualitas dengan DA/DR tinggi, history bersih. Domain expired & deleted dengan metrics terbukti untuk SEO."
        keywords="aged domain, expired domain, deleted domain, domain dijual, beli domain bekas"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <span className="text-blue-400 text-sm font-medium">AGED DOMAINS</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 text-white">
            <span className="text-blue-400">Aged Domain</span> Premium
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Domain expired & deleted berkualitas dengan authority tinggi. Perfect untuk PBN atau project baru Anda.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-panel p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="30">30+</option>
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
                <option value="age">Age (Oldest)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="w-full bg-blue-600/20 border border-blue-500/30 rounded-lg h-10 px-4 flex items-center">
                <span className="text-blue-400 font-medium">
                  {filteredDomains.length} Domains Available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDomains.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((domain, index) => (
            <div
              key={domain.id}
              data-testid={`domain-item-${index}`}
              className="glass-panel p-6 hover:bg-slate-900/50 transition-all card-hover"
            >
              {/* Domain Name */}
              <div className="mb-4">
                <div className="text-blue-400 font-semibold text-lg mb-2 break-all">{domain.domain_name}</div>
                <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                  Available
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{domain.dr}</div>
                  <div className="text-xs text-slate-500">DR</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{domain.da}</div>
                  <div className="text-xs text-slate-500">DA</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{domain.age}y</div>
                  <div className="text-xs text-slate-500">Age</div>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-4 gap-2 mb-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-white">{domain.pa}</div>
                  <div className="text-xs text-slate-500">PA</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white">{domain.ur}</div>
                  <div className="text-xs text-slate-500">UR</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white">{domain.tf}</div>
                  <div className="text-xs text-slate-500">TF</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white">{domain.cf}</div>
                  <div className="text-xs text-slate-500">CF</div>
                </div>
              </div>

              {/* Registrar */}
              <div className="mb-4">
                <div className="text-xs text-slate-500 mb-1">Registrar:</div>
                <div className="text-sm text-slate-300">{domain.registrar}</div>
              </div>

              {/* Web Archive */}
              {domain.web_archive_history && (
                <div className="mb-4">
                  <a
                    href={domain.web_archive_history}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <ExternalLink size={14} />
                    View Archive History
                  </a>
                </div>
              )}

              {/* Price & CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Harga</div>
                  <div className="text-blue-400 font-bold text-xl">{formatIDR(domain.price)}</div>
                </div>
                <button
                  onClick={() => handleOrderClick(domain)}
                  data-testid={`domain-order-${index}`}
                  className="bg-green-600 hover:bg-green-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  Order
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filteredDomains.length > ITEMS_PER_PAGE && (
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
              Halaman <span className="text-white font-semibold">{page}</span> dari <span className="text-white font-semibold">{Math.ceil(filteredDomains.length / ITEMS_PER_PAGE)}</span>
            </div>
            {page < Math.ceil(filteredDomains.length / ITEMS_PER_PAGE) && (
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

        {/* Info Section */}
        <div className="glass-panel p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Kenapa Beli Aged Domain?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Authority Instant</h3>
              <p className="text-slate-300 text-sm">Domain aged sudah punya authority & backlink history. Tidak perlu start from zero.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Ranking Lebih Cepat</h3>
              <p className="text-slate-300 text-sm">Google trust aged domain lebih dari domain baru. Ranking bisa lebih cepat naik.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Perfect untuk PBN</h3>
              <p className="text-slate-300 text-sm">Aged domain adalah fondasi PBN berkualitas. Build network Anda dengan domain terbukti.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainsPage;