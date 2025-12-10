/**
 * Generate WhatsApp order message
 */
export const generateWhatsAppMessage = (packageName, backlinkCount, url = '', anchor = '') => {
  let message = `Halo admin DomainPBN! 👋\n\n`;
  message += `Saya mau pesan *${packageName}* (${backlinkCount} backlink).\n\n`;
  
  if (url) {
    message += `📌 *URL Target:*\n${url}\n\n`;
  }
  
  if (anchor) {
    message += `🔗 *Anchor Text:*\n${anchor}\n\n`;
  }
  
  if (!url && !anchor) {
    message += `Mohon info detail lebih lanjut tentang paket ini.\n\n`;
  }
  
  message += `Terima kasih!`;
  
  return encodeURIComponent(message);
};

/**
 * Generate WhatsApp URL with message
 */
export const getWhatsAppURL = (phoneNumber, message) => {
  // Remove any non-digit characters
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${message}`;
};

/**
 * Generate custom PBN order message
 */
export const generateCustomPBNMessage = (pbnCode = '') => {
  let message = `Halo admin DomainPBN! 👋\n\n`;
  message += `Saya tertarik untuk order backlink dengan custom PBN.\n\n`;
  
  if (pbnCode) {
    message += `PBN yang saya pilih: *${pbnCode}*\n\n`;
  }
  
  message += `Mohon info lebih lanjut tentang harga dan prosesnya.\n\n`;
  message += `Terima kasih!`;
  
  return encodeURIComponent(message);
};

/**
 * Generate general inquiry message
 */
export const generateInquiryMessage = () => {
  let message = `Halo admin DomainPBN! 👋\n\n`;
  message += `Saya ingin bertanya tentang layanan backlink PBN Anda.\n\n`;
  message += `Mohon info lebih lanjut.\n\n`;
  message += `Terima kasih!`;
  
  return encodeURIComponent(message);
};