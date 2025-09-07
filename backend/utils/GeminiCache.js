/**
 * In-memory cache for storing the last Gemini response
 * This prevents duplicate consecutive items from being stored
 */
class GeminiCache {
  constructor() {
    this.lastResponse = null;
    this.lastPhotoHash = null;
    this.lastTimestamp = null;
  }

  /**
   * Check if the current response is the same as the last one
   * @param {Object} analysisResult - Current Gemini analysis result
   * @param {string} photoHash - Hash of current photo
   * @returns {boolean} - True if duplicate, false if different
   */
  isDuplicate(analysisResult, photoHash) {
    if (!this.lastResponse) {
      return false; // No previous response to compare
    }

    // Check if item and weight are the same
    const sameItem = this.lastResponse.item === analysisResult.item;
    const sameWeight = this.lastResponse.weight_in_grams === analysisResult.weight_in_grams;
    
    // Log comparison for debugging
    console.log('🔄 Checking for duplicate response:');
    console.log('   Last:', this.lastResponse);
    console.log('   Current:', analysisResult);
    console.log('   Same item:', sameItem);
    console.log('   Same weight:', sameWeight);
    
    return sameItem && sameWeight;
  }

  /**
   * Update the cache with new response
   * @param {Object} analysisResult - Gemini analysis result
   * @param {string} photoHash - Hash of photo
   */
  updateCache(analysisResult, photoHash) {
    this.lastResponse = {
      item: analysisResult.item,
      weight_in_grams: analysisResult.weight_in_grams
    };
    this.lastPhotoHash = photoHash;
    this.lastTimestamp = new Date();
    
    console.log('💾 Cache updated with:', this.lastResponse);
  }

  /**
   * Clear the cache
   */
  clear() {
    this.lastResponse = null;
    this.lastPhotoHash = null;
    this.lastTimestamp = null;
    console.log('🗑️ Cache cleared');
  }

  /**
   * Get current cache status
   */
  getStatus() {
    return {
      hasCache: !!this.lastResponse,
      lastResponse: this.lastResponse,
      lastPhotoHash: this.lastPhotoHash,
      lastTimestamp: this.lastTimestamp
    };
  }
}

// Create singleton instance
const geminiCache = new GeminiCache();

module.exports = geminiCache;
