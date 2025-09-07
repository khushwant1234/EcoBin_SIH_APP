const express = require('express');
const router = express.Router();
const { 
  submitBinData, 
  getLatestBinData, 
  analyzeLatestPhoto, 
  analyzePhoto,
  getAnalysisHistory,
  getBinFillLevels,
  getBasicFillLevels,
  getLatestItems,
  getRecentAnalyses,
  getAnalysisStats,
  getCacheStatus,
  clearCache
} = require('../Controllers/BinController');

// Public routes - no authentication required
router.post('/submit', submitBinData);
router.get('/latest', getLatestBinData);

// Fill level calculation routes
router.get('/fill-levels', getBinFillLevels);
router.get('/fill-levels/basic', getBasicFillLevels);

// Latest items route for frontend
router.get('/items/latest', getLatestItems);

// Debug route for recent analyses
router.get('/debug/recent', getRecentAnalyses);

// AI Analysis routes
router.get('/analyze/latest', analyzeLatestPhoto);
router.post('/analyze', analyzePhoto);

// Analysis history and statistics routes
router.get('/analysis/history', getAnalysisHistory);
router.get('/analysis/stats', getAnalysisStats);

// Cache management routes
router.get('/cache/status', getCacheStatus);
router.post('/cache/clear', clearCache);

module.exports = router;
