import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, TrendingUp, CheckCircle } from 'lucide-react';
import { packagesAPI, pbnAPI, blogAPI, settingsAPI, domainsAPI } from '../api/client';
import { generateWhatsAppMessage, getWhatsAppURL } from '../utils/whatsapp';
import { formatIDR, formatNumber } from '../utils/format';
import SEOHead from '../components/SEOHead';

const Homepage = () => {
  const [packages, setPackages] = useState([]);
  const [pbnSites, setPbnSites] = useState([]);
  const [agedDomains, setAgedDomains] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, pbnRes, domainsRes, blogRes, settingsRes] = await Promise.all([
          packagesAPI.getPublic(),
          pbnAPI.getPublic({ sort_by: 'dr', limit: 6 }),
          domainsAPI.getPublic({ sort_by: 'dr', limit: 6 }),
          blogAPI.getList({ limit: 3 }),
          settingsAPI.get(),
        ]);
        setPackages(pkgRes.data.slice(0, 3));
        setPbnSites(pbnRes.data);
        setAgedDomains(domainsRes.data);
        setBlogPosts(blogRes.data);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOrderClick = (pkg) => {
    if (!settings) return;
    const message = generateWhatsAppMessage(pkg.name, pkg.backlink_count);
    const url = getWhatsAppURL(settings.whatsapp_number, message);
    window.open(url, '_blank');
  };

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Domain Aged & Bersih',
      description: 'Semua PBN menggunakan aged domain dengan history bersih dan spam score rendah'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Hasil Cepat & Aman',
      description: 'Lihat peningkatan ranking dalam 2-4 minggu dengan metode white-hat SEO'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Authority Tinggi',
      description: 'Domain Rating 40-75 dengan traffic real dan metrics terbukti'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="homepage">
      <SEOHead />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1489436969537-cf0c1dc69cba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbmV0d29yayUyMGNvbm5lY3Rpb25zJTIwYmx1ZSUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc2NTM0OTM3OXww&ixlib=rb-4.1.0&q=85')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32 text-center">
          <div className="animate-fade-in">
            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <span className="text-blue-400 text-sm font-medium">Trusted by 500+ Websites</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-6 text-white">
              Premium PBN –<br />
              <span className="text-gradient bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Harga Murah, Kualitas Tinggi
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Backlink Powerful, Ranking Naik, Budget Aman. Tingkatkan authority website Anda dengan PBN premium.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/paket"
                data-testid="hero-cta-paket"
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 py-3 font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] inline-flex items-center gap-2"
              >
                Lihat Paket
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/pbn"
                data-testid="hero-cta-pbn"
                className="bg-transparent border border-white/20 text-white hover:bg-white/5 rounded-full px-8 py-3 transition-all inline-flex items-center gap-2"
              >
                Lihat PBN Network
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            {[
              { label: 'PBN Sites', value: '100+' },
              { label: 'Avg DR', value: '60+' },
              { label: 'Happy Clients', value: '500+' },
              { label: 'Backlinks Delivered', value: '10K+' },
            ].map((stat, index) => (
              <div key={index} className="glass-panel p-6">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">
              Mengapa Pilih <span className="text-blue-400">DomainPBN</span>?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Backlink berkualitas tinggi dengan harga yang terjangkau untuk semua ukuran bisnis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-panel p-8 hover:bg-slate-900/50 transition-all card-hover group">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                  <div className="text-blue-400">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">
              Paket <span className="text-blue-400">Backlink</span> Kami
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Pilih paket yang sesuai dengan budget dan kebutuhan SEO Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                data-testid={`package-card-${index}`}
                className={`relative overflow-hidden glass-panel p-8 card-hover ${
                  pkg.is_popular ? 'border-2 border-blue-500/50' : ''
                }`}
              >
                {pkg.is_popular && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    PALING POPULER
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-blue-400">{formatIDR(pkg.price)}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">{pkg.backlink_count} Backlink Premium</p>
                </div>
                
                <p className="text-slate-300 mb-6 leading-relaxed">{pkg.description}</p>

                <button
                  onClick={() => handleOrderClick(pkg)}
                  data-testid={`order-button-${index}`}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-3 font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
                >
                  Order via WhatsApp
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/paket"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Lihat Semua Paket
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* PBN Preview Section */}
      <section className="py-24 md:py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">
              Sample <span className="text-blue-400">PBN Network</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Lihat metrics PBN kami yang transparan dan berkualitas tinggi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pbnSites.map((site, index) => (
              <div key={site.id} data-testid={`pbn-preview-${index}`} className="glass-panel p-6 hover:bg-slate-900/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-blue-400 font-semibold text-lg mb-1">{site.code}</div>
                    <div className="text-slate-400 text-sm">{site.niche}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{site.dr}</div>
                    <div className="text-xs text-slate-500">DR</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <div className="text-sm font-semibold text-white">{site.da}</div>
                    <div className="text-xs text-slate-500">DA</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{formatNumber(site.traffic)}</div>
                    <div className="text-xs text-slate-500">Traffic</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{site.age}y</div>
                    <div className="text-xs text-slate-500">Age</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-slate-500">Spam Score: {site.spam_score}%</span>
                  <span className="text-blue-400 font-semibold text-sm">{formatIDR(site.price_per_post)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/pbn"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Lihat Semua PBN Network
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Aged Domains Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">
              Domain <span className="text-blue-400">Aged & Expired</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Domain berkualitas dengan authority tinggi siap untuk digunakan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agedDomains.map((domain, index) => (
              <div key={domain.id} data-testid={`domain-preview-${index}`} className="glass-panel p-6 hover:bg-slate-900/50 transition-all">
                <div className="mb-4">
                  <div className="text-blue-400 font-semibold text-lg mb-2 break-all">{domain.domain_name}</div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-medium">
                      {domain.status.toUpperCase()}
                    </span>
                    <span>• {domain.age} tahun</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <div className="text-sm font-semibold text-white">{domain.dr}</div>
                    <div className="text-xs text-slate-500">DR</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{domain.da}</div>
                    <div className="text-xs text-slate-500">DA</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{domain.pa}</div>
                    <div className="text-xs text-slate-500">PA</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-slate-500">{domain.registrar}</span>
                  <span className="text-blue-400 font-bold">{formatIDR(domain.price)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/domains"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Lihat Semua Domain
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 md:py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">
              Artikel <span className="text-blue-400">Terbaru</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Tips dan panduan SEO untuk memaksimalkan hasil backlink PBN
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                data-testid={`blog-preview-${index}`}
                className="glass-panel overflow-hidden card-hover group"
              >
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
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Lihat Semua Artikel
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-slate-950">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6 text-white">
            Siap Tingkatkan <span className="text-blue-400">Ranking</span> Website Anda?
          </h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Mulai bangun authority website Anda dengan backlink PBN premium hari ini.
            Konsultasi gratis dengan tim kami!
          </p>
          <Link
            to="/paket"
            data-testid="bottom-cta-button"
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 py-3 font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] inline-flex items-center gap-2"
          >
            Mulai Sekarang
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;