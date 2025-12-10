import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqAPI } from '../api/client';
import SEOHead from '../components/SEOHead';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await faqAPI.getPublic();
        setFaqs(response.data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="faq-page">
      <SEOHead
        title="FAQ - Pertanyaan Umum Tentang Backlink PBN | DomainPBN"
        description="Temukan jawaban atas pertanyaan umum tentang layanan backlink PBN kami: keamanan, harga, proses order, dan hasil yang bisa diharapkan."
        keywords="faq backlink, pertanyaan pbn, tanya jawab seo"
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <span className="text-blue-400 text-sm font-medium">FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 text-white">
            Pertanyaan <span className="text-blue-400">Umum</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
            Temukan jawaban atas pertanyaan yang sering ditanyakan tentang layanan backlink PBN kami
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="glass-panel p-8 md:p-12">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={`item-${index}`}
                data-testid={`faq-item-${index}`}
                className="border border-white/10 rounded-xl overflow-hidden bg-slate-900/30"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-slate-900/50 transition-colors">
                  <span className="text-left text-white font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div className="mt-12 glass-panel p-8 md:p-12 text-center">
          <h3 className="text-2xl font-semibold text-white mb-4">
            Masih Punya Pertanyaan?
          </h3>
          <p className="text-slate-300 mb-6">
            Tim kami siap membantu Anda via WhatsApp atau Telegram
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-500 text-white rounded-full px-8 py-3 font-medium transition-all shadow-lg hover:shadow-xl inline-block"
            >
              Chat via WhatsApp
            </a>
            <a
              href="https://t.me/domainpbn"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 py-3 font-medium transition-all inline-block"
            >
              Chat via Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;