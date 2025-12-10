import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { updateMetaTags } from '../utils/seo';

const SEOHead = ({
  title = 'DomainPBN - Premium Backlinks PBN Murah & Berkualitas',
  description = 'Layanan backlink PBN premium dengan harga terjangkau. Domain aged, DR tinggi, spam score rendah. Tingkatkan ranking website Anda dengan aman.',
  keywords = 'backlink pbn, jasa backlink, pbn murah, backlink berkualitas, seo indonesia',
  ogImage = 'https://linkpremium.preview.emergentagent.com/og-image.jpg',
}) => {
  const location = useLocation();
  const baseUrl = 'https://linkpremium.preview.emergentagent.com';

  useEffect(() => {
    updateMetaTags({
      title,
      description,
      keywords,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogUrl: `${baseUrl}${location.pathname}`,
      canonical: `${baseUrl}${location.pathname}`,
    });
  }, [title, description, keywords, ogImage, location.pathname]);

  return null;
};

export default SEOHead;