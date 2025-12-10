import React, { useState, useEffect } from 'react';
import { Check, MessageCircle, Send } from 'lucide-react';
import { packagesAPI, settingsAPI } from '../api/client';
import { generateWhatsAppMessage, getWhatsAppURL } from '../utils/whatsapp';
import { getTelegramURL } from '../utils/telegram';
import { formatIDR } from '../utils/format';
import SEOHead from '../components/SEOHead';

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, settingsRes] = await Promise.all([
          packagesAPI.getPublic(),
          settingsAPI.get(),
        ]);
        setPackages(pkgRes.data);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleWhatsAppOrder = (pkg) => {
    if (!settings) return;
    const message = generateWhatsAppMessage(pkg.name, pkg.backlink_count);
    const url = getWhatsAppURL(settings.whatsapp_number, message);
    window.open(url, '_blank');
  };

  const handleTelegramOrder = (pkg) => {
    if (!settings?.telegram_username) return;
    const message = `Saya mau pesan ${pkg.name} (${pkg.backlink_count} backlink)`;
    const url = getTelegramURL(settings.telegram_username, message);
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
    <div className="min-h-screen pt-24 pb-16" data-testid="packages-page">
      <SEOHead
        title="Paket Backlink PBN - DomainPBN"
        description="Pilih paket backlink PBN sesuai kebutuhan Anda. Mulai dari Starter hingga Enterprise dengan harga terjangkau dan kualitas terjamin."
        keywords="paket backlink, harga backlink pbn, jasa backlink murah, paket seo"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <span className="text-blue-400 text-sm font-medium">PRICING PLANS</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 text-white">
            Pilih <span className="text-blue-400">Paket</span> Anda
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Semua paket menggunakan PBN premium dengan domain aged, DR tinggi, dan spam score rendah.
            Harga transparan, tanpa biaya tersembunyi.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              data-testid={`package-item-${index}`}
              className={`relative overflow-hidden glass-panel p-8 card-hover ${
                pkg.is_popular ? 'border-2 border-blue-500/50 scale-105' : ''
              }`}
            >
              {pkg.is_popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-br from-blue-600 to-blue-400 text-white text-xs font-semibold px-4 py-2 rounded-bl-2xl">
                  ⭐ TERPOPULER
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">{pkg.name}</h2>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-blue-400">{formatIDR(pkg.price)}</span>
                </div>
                <p className="text-slate-400">{pkg.backlink_count} Backlink Premium</p>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-slate-300 leading-relaxed">{pkg.description}</p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  'Domain aged dengan authority tinggi',
                  'Artikel berkualitas & readable',
                  'Spam score rendah < 2%',
                  'Backlink permanent',
                  'Laporan lengkap',
                  pkg.is_popular ? 'Drip posting included' : 'Support via WhatsApp',
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleWhatsAppOrder(pkg)}
                  data-testid={`whatsapp-order-${index}`}
                  className="w-full bg-green-600 hover:bg-green-500 text-white rounded-full px-6 py-3 font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Order via WhatsApp
                </button>
                {settings?.telegram_username && (
                  <button
                    onClick={() => handleTelegramOrder(pkg)}
                    data-testid={`telegram-order-${index}`}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-3 font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Order via Telegram
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="glass-panel p-8 md:p-12">
          <h3 className="text-2xl font-semibold text-white mb-6">Proses Order</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Pilih Paket', desc: 'Pilih paket yang sesuai dengan kebutuhan Anda' },
              { step: '2', title: 'Order via WA/Telegram', desc: 'Klik tombol order dan chat dengan admin' },
              { step: '3', title: 'Pembayaran', desc: 'Transfer sesuai invoice yang dikirimkan' },
              { step: '4', title: 'Pengerjaan', desc: 'Kami mulai posting dalam 1-3 hari kerja' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 font-bold text-lg">{item.step}</span>
                </div>
                <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Mini */}
        <div className="mt-16 glass-panel p-8 md:p-12">
          <h3 className="text-2xl font-semibold text-white mb-8 text-center">Pertanyaan Umum</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'Apakah saya bisa custom pilih PBN?',
                a: 'Ya, Anda bisa request niche tertentu atau memilih dari list PBN kami.',
              },
              {
                q: 'Berapa lama pengerjaan?',
                a: 'Pengerjaan dimulai 1-3 hari kerja setelah pembayaran. Untuk drip posting, 2-3 artikel per minggu.',
              },
              {
                q: 'Apakah backlink permanent?',
                a: 'Ya, semua backlink bersifat permanent dan tidak akan dihapus.',
              },
              {
                q: 'Bagaimana jika website saya baru?',
                a: 'Tidak masalah! Kami akan sesuaikan strategi backlink untuk website baru agar aman.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-slate-900/50 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                <p className="text-slate-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;