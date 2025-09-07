const mongoose = require('mongoose');

const geminiResponseSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  weight_in_grams: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['organic', 'hazardous', 'recyclable'],
    required: true,
    index: true
  },
  photoHash: {
    type: String,
    required: true,
    index: true
  },
  binCounts: {
    organic: {
      type: Number,
      default: 0
    },
    hazardous: {
      type: Number,
      default: 0
    },
    recyclable: {
      type: Number,
      default: 0
    }
  },
  rawResponse: {
    type: String  // Store the raw Gemini response for debugging
  },
  analysisStatus: {
    type: String,
    enum: ['completed', 'failed'],
    default: 'completed'
  },
  errorMessage: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
geminiResponseSchema.index({ createdAt: -1 });
geminiResponseSchema.index({ photoHash: 1, createdAt: -1 });

// Static method to save a new analysis
geminiResponseSchema.statics.saveAnalysis = async function(analysisData, photoHash, binCounts, rawResponse, category) {
  const newAnalysis = new this({
    item: analysisData.item,
    weight_in_grams: analysisData.weight_in_grams,
    category: category,
    photoHash: photoHash,
    binCounts: binCounts,
    rawResponse: rawResponse,
    analysisStatus: 'completed'
  });
  
  return await newAnalysis.save();
};

// Static method to save a failed analysis
geminiResponseSchema.statics.saveFailedAnalysis = async function(photoHash, binCounts, errorMessage, category, rawResponse = null) {
  const failedAnalysis = new this({
    item: 'analysis_failed',
    weight_in_grams: 0,
    category: category,
    photoHash: photoHash,
    binCounts: binCounts,
    rawResponse: rawResponse,
    analysisStatus: 'failed',
    errorMessage: errorMessage
  });
  
  return await failedAnalysis.save();
};

// Static method to get all analyses
geminiResponseSchema.statics.getAllAnalyses = async function(limit = 50) {
  return await this.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-rawResponse'); // Exclude raw response for performance
};

// Static method to get analyses by photo hash
geminiResponseSchema.statics.getAnalysesByPhoto = async function(photoHash) {
  return await this.find({ photoHash: photoHash })
    .sort({ createdAt: -1 });
};

const GeminiResponse = mongoose.model('GeminiResponse', geminiResponseSchema);

module.exports = GeminiResponse;
