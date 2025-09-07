const express = require('express');
const router = express.Router();
const { 
  submitBinData, 
  getLatestBinData, 
  analyzeLatestPhoto, 
  analyzePhoto,
  getAnalysisHistory,
  getAnalysisStats 
} = require('../Controllers/BinController');

// Public routes - no authentication required
router.post('/submit', submitBinData);
router.get('/latest', getLatestBinData);

// AI Analysis routes
router.get('/analyze/latest', analyzeLatestPhoto);
router.post('/analyze', analyzePhoto);

// Analysis history and statistics routes
router.get('/analysis/history', getAnalysisHistory);
router.get('/analysis/stats', getAnalysisStats);

module.exports = router;
