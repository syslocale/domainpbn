/**
 * Generate Telegram URL
 */
export const getTelegramURL = (username, message = '') => {
  if (message) {
    return `https://t.me/${username}?text=${encodeURIComponent(message)}`;
  }
  return `https://t.me/${username}`;
};