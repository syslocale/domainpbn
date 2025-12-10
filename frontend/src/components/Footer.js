import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { settingsAPI } from '../api/client';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.get();
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Layanan',
      links: [
        { name: 'Paket Backlink', path: '/paket' },
        { name: 'PBN Network', path: '/pbn' },
        { name: 'Blog', path: '/blog' },
      ],
    },
    {
      title: 'Perusahaan',
      links: [
        { name: 'Tentang Kami', path: '/about' },
        { name: 'FAQ', path: '/faq' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Syarat & Ketentuan', path: '/tos' },
        { name: 'Kebijakan Privasi', path: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="bg-slate-950 border-t border-white/10 py-16" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 group mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                DomainPBN
              </span>
            </Link>
            <p className="text-slate-400 text-sm mb-4 max-w-sm leading-relaxed">
              {settings?.tagline || 'Premium PBN Backlinks - Harga Murah, Kualitas Tinggi'}
            </p>
            {/* Social Links */}
            {settings?.social_links && (
              <div className="flex items-center gap-3">
                {settings.social_links.instagram && (
                  <a
                    href={settings.social_links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/50 flex items-center justify-center transition-all"
                    aria-label="Instagram"
                  >
                    <Instagram size={16} className="text-slate-400 hover:text-blue-400" />
                  </a>
                )}
                {settings.social_links.twitter && (
                  <a
                    href={settings.social_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/50 flex items-center justify-center transition-all"
                    aria-label="Twitter"
                  >
                    <Twitter size={16} className="text-slate-400 hover:text-blue-400" />
                  </a>
                )}
                {settings.social_links.facebook && (
                  <a
                    href={settings.social_links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/50 flex items-center justify-center transition-all"
                    aria-label="Facebook"
                  >
                    <Facebook size={16} className="text-slate-400 hover:text-blue-400" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              {settings?.footer_text || `DomainPBN © ${currentYear}. Premium Backlinks untuk SEO Anda.`}
            </p>
            <p className="text-slate-500 text-xs">
              Built with ❤️ for Indonesian SEO Community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;