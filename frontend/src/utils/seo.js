/**
 * Update page meta tags for SEO
 */
export const updateMetaTags = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  canonical
}) => {
  // Update title
  if (title) {
    document.title = title;
  }

  // Update or create meta description
  if (description) {
    updateOrCreateMetaTag('name', 'description', description);
  }

  // Update or create meta keywords
  if (keywords) {
    updateOrCreateMetaTag('name', 'keywords', keywords);
  }

  // Open Graph tags
  if (ogTitle) {
    updateOrCreateMetaTag('property', 'og:title', ogTitle || title);
  }
  if (ogDescription) {
    updateOrCreateMetaTag('property', 'og:description', ogDescription || description);
  }
  if (ogImage) {
    updateOrCreateMetaTag('property', 'og:image', ogImage);
  }
  if (ogUrl) {
    updateOrCreateMetaTag('property', 'og:url', ogUrl);
  }
  updateOrCreateMetaTag('property', 'og:type', 'website');

  // Twitter Card tags
  updateOrCreateMetaTag('name', 'twitter:card', 'summary_large_image');
  if (ogTitle) {
    updateOrCreateMetaTag('name', 'twitter:title', ogTitle || title);
  }
  if (ogDescription) {
    updateOrCreateMetaTag('name', 'twitter:description', ogDescription || description);
  }
  if (ogImage) {
    updateOrCreateMetaTag('name', 'twitter:image', ogImage);
  }

  // Canonical URL
  if (canonical) {
    updateOrCreateLinkTag('canonical', canonical);
  }
};

/**
 * Helper function to update or create meta tag
 */
const updateOrCreateMetaTag = (attribute, attributeValue, content) => {
  let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attributeValue);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

/**
 * Helper function to update or create link tag
 */
const updateOrCreateLinkTag = (rel, href) => {
  let element = document.querySelector(`link[rel="${rel}"]`);
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
};

/**
 * Generate structured data (JSON-LD) for articles
 */
export const generateArticleSchema = (article) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.thumbnail,
    datePublished: article.published_at,
    dateModified: article.published_at,
    author: {
      '@type': 'Organization',
      name: 'DomainPBN'
    },
    publisher: {
      '@type': 'Organization',
      name: 'DomainPBN',
      logo: {
        '@type': 'ImageObject',
        url: 'https://linkpremium.preview.emergentagent.com/logo.png'
      }
    }
  };
};

/**
 * Add JSON-LD structured data to page
 */
export const addStructuredData = (data) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
  return script;
};

/**
 * Remove structured data script
 */
export const removeStructuredData = (script) => {
  if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }
};