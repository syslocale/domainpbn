import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { settingsAPI } from '../api/client';
import { getWhatsAppURL, generateInquiryMessage } from '../utils/whatsapp';

const FloatingWhatsApp = () => {
  const [settings, setSettings] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

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

    // Show button after scroll
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!settings) return null;

  const handleClick = () => {
    const message = generateInquiryMessage();
    const url = getWhatsAppURL(settings.whatsapp_number, message);
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      data-testid="floating-whatsapp-button"
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Chat WhatsApp"
    >
      <MessageCircle size={24} className="animate-pulse" />
      
      {/* Tooltip */}
      <div className="absolute right-16 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat dengan Kami
        <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
      </div>
    </button>
  );
};

export default FloatingWhatsApp;