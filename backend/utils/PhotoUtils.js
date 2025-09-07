const crypto = require('crypto');

/**
 * Generate a hash for photo data to detect changes
 * @param {string} photoData - Base64 photo data
 * @returns {string} - SHA256 hash
 */
const generatePhotoHash = (photoData) => {
  if (!photoData) return null;
  
  // Remove data URL prefix if present
  const cleanBase64 = photoData.replace(/^data:image\/[a-z]+;base64,/, '');
  
  // Generate SHA256 hash
  return crypto.createHash('sha256').update(cleanBase64).digest('hex');
};

/**
 * Compare two photo hashes
 * @param {string} hash1 
 * @param {string} hash2 
 * @returns {boolean}
 */
const comparePhotoHashes = (hash1, hash2) => {
  if (!hash1 && !hash2) return true;  // Both null/undefined
  if (!hash1 || !hash2) return false; // One is null/undefined
  return hash1 === hash2;
};

module.exports = {
  generatePhotoHash,
  comparePhotoHashes
};
