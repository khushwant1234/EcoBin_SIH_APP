const { AsyncHandler } = require('../utils/AsyncHandler');
const { ApiError } = require('../utils/ApiError');
const Bin = require('../Models/binModel');
const GeminiResponse = require('../Models/geminiResponseModel');
const GeminiService = require('../utils/GeminiService');
const { generatePhotoHash } = require('../utils/PhotoUtils');
const geminiCache = require('../utils/GeminiCache');

// Helper function to determine category from counter changes
const determineCategoryFromChanges = (changes) => {
  console.log('🔍 Determining category from changes:', changes);
  
  // Count how many bins changed
  const changedBins = [];
  if (changes.organic) changedBins.push('organic');
  if (changes.hazardous) changedBins.push('hazardous');
  if (changes.recyclable) changedBins.push('recyclable');
  
  console.log('📊 Changed bins:', changedBins);
  
  if (changedBins.length === 0) {
    console.log('⚠️ No bin changes detected, defaulting to organic');
    return 'organic';
  }
  
  if (changedBins.length === 1) {
    console.log('✅ Single bin changed:', changedBins[0]);
    return changedBins[0];
  }
  
  // If multiple bins changed, prioritize in order: hazardous > recyclable > organic
  // This is because hazardous items are most important to track correctly
  if (changes.hazardous) {
    console.log('⚠️ Multiple bins changed, prioritizing hazardous');
    return 'hazardous';
  } else if (changes.recyclable) {
    console.log('♻️ Multiple bins changed, prioritizing recyclable'); 
    return 'recyclable';
  } else {
    console.log('🌱 Multiple bins changed, defaulting to organic');
    return 'organic';
  }
};

// Debug endpoint to check recent analysis attempts (including failed ones)
const getRecentAnalyses = AsyncHandler(async (req, res) => {
  try {
    console.log('🔍 Fetching recent analyses for debugging...');
    
    // Get the 10 most recent analyses (both successful and failed)
    const recentAnalyses = await GeminiResponse.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('item weight_in_grams category analysisStatus errorMessage createdAt')
      .lean();
    
    // Format the response for debugging
    const formattedAnalyses = recentAnalyses.map(analysis => ({
      id: analysis._id,
      item: analysis.item,
      weight: analysis.weight_in_grams,
      category: analysis.category,
      status: analysis.analysisStatus,
      error: analysis.errorMessage || null,
      createdAt: analysis.createdAt,
      timeAgo: getTimeAgo(analysis.createdAt)
    }));
    
    const statusCounts = {
      completed: recentAnalyses.filter(a => a.analysisStatus === 'completed').length,
      failed: recentAnalyses.filter(a => a.analysisStatus === 'failed').length
    };
    
    console.log(`🔍 Retrieved ${formattedAnalyses.length} recent analyses`);
    console.log('📊 Status breakdown:', statusCounts);
    
    res.status(200).json({
      success: true,
      message: "Recent analyses retrieved successfully",
      data: {
        analyses: formattedAnalyses,
        statusCounts: statusCounts,
        totalAnalyses: formattedAnalyses.length,
        retrievedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching recent analyses:', error);
    throw new ApiError(500, "Failed to retrieve recent analyses");
  }
});

// Controller to handle bin data submission
const submitBinData = AsyncHandler(async (req, res) => {
  const { organic, hazardous, recyclable, Organic, Hazardous, Recyclable, photo } = req.body;
  
  // Log the received data
  console.log('=== Received Bin Data ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Organic (lowercase):', organic);
  console.log('Hazardous (lowercase):', hazardous);
  console.log('Recyclable (lowercase):', recyclable);
  console.log('Organic (uppercase):', Organic);
  console.log('Hazardous (uppercase):', Hazardous);
  console.log('Recyclable (uppercase):', Recyclable);
  console.log('Photo length:', photo ? photo.length : 'No photo provided');
  console.log('Full payload:', req.body);
  console.log('========================');
  
  // Prepare data for storage - handle both case formats and convert to numbers
  const binData = {};
  
  // Handle uppercase format (from Flask server) - convert to number
  if (Organic !== undefined) {
    const organicCount = parseInt(Organic, 10);
    if (!isNaN(organicCount) && organicCount >= 0) {
      binData.organic = organicCount;
    }
  }
  if (Hazardous !== undefined) {
    const hazardousCount = parseInt(Hazardous, 10);
    if (!isNaN(hazardousCount) && hazardousCount >= 0) {
      binData.hazardous = hazardousCount;
    }
  }
  if (Recyclable !== undefined) {
    const recyclableCount = parseInt(Recyclable, 10);
    if (!isNaN(recyclableCount) && recyclableCount >= 0) {
      binData.recyclable = recyclableCount;
    }
  }
  
  // Handle lowercase format - fallback and convert to number
  if (organic !== undefined && binData.organic === undefined) {
    const organicCount = parseInt(organic, 10);
    if (!isNaN(organicCount) && organicCount >= 0) {
      binData.organic = organicCount;
    }
  }
  if (hazardous !== undefined && binData.hazardous === undefined) {
    const hazardousCount = parseInt(hazardous, 10);
    if (!isNaN(hazardousCount) && hazardousCount >= 0) {
      binData.hazardous = hazardousCount;
    }
  }
  if (recyclable !== undefined && binData.recyclable === undefined) {
    const recyclableCount = parseInt(recyclable, 10);
    if (!isNaN(recyclableCount) && recyclableCount >= 0) {
      binData.recyclable = recyclableCount;
    }
  }
  
  // Handle photo
  if (photo !== undefined) binData.photo = photo;
  
  try {
    // Check if data has actually changed before updating
    const changeCheck = await Bin.hasDataChanged(binData);
    
    if (!changeCheck.hasChanged) {
      console.log('📊 No changes detected - data is identical to stored values');
      
      // Get current data to return
      const currentData = changeCheck.currentData;
      
      const responseData = {
        id: currentData._id,
        organic: currentData.organic,
        hazardous: currentData.hazardous,
        recyclable: currentData.recyclable,
        photoReceived: !!currentData.photo,
        lastUpdated: currentData.lastUpdated,
        timestamp: new Date().toISOString(),
        dataChanged: false,
        analysisStatus: 'skipped_no_changes'
      };
      
      return res.status(200).json({
        success: true,
        message: "No changes detected - data unchanged",
        data: responseData
      });
    }
    
    console.log('🔄 Changes detected:', changeCheck.changes);
    console.log('📝 Previous data:', {
      organic: changeCheck.currentData?.organic,
      hazardous: changeCheck.currentData?.hazardous, 
      recyclable: changeCheck.currentData?.recyclable
    });
    console.log('📝 New data:', {
      organic: binData.organic,
      hazardous: binData.hazardous,
      recyclable: binData.recyclable
    });
    
    // Update/create the latest bin data (overwrites previous data)
    const savedData = await Bin.updateLatestData(binData);
    
    console.log('✅ Data saved to database:', savedData._id);
    
    // Prepare response data
    const responseData = {
      id: savedData._id,
      organic: savedData.organic,
      hazardous: savedData.hazardous,
      recyclable: savedData.recyclable,
      photoReceived: !!savedData.photo,
      lastUpdated: savedData.lastUpdated,
      timestamp: new Date().toISOString(),
      dataChanged: true,
      changes: changeCheck.changes
    };
    
    // If photo is included and EITHER photo OR counter data has changed, analyze with Gemini AI
    if (savedData.photo && (changeCheck.changes.photo || changeCheck.changes.organic || changeCheck.changes.hazardous || changeCheck.changes.recyclable)) {
      console.log('📸 Photo exists and data changed - analyzing with Gemini AI...');
      console.log('🔍 Changes detected:', {
        photo: changeCheck.changes.photo,
        counters: {
          organic: changeCheck.changes.organic,
          hazardous: changeCheck.changes.hazardous,
          recyclable: changeCheck.changes.recyclable
        }
      });
      
      // FIRST: Determine category from counter changes BEFORE calling Gemini
      const category = determineCategoryFromChanges(changeCheck.changes);
      console.log('🗂️ Determined category from counter changes:', category);
      
      try {
        const geminiService = new GeminiService();
        const photoHash = generatePhotoHash(savedData.photo);
        
        console.log('🔍 Generated photo hash:', photoHash);
        
        // Analyze with Gemini (we already know the category)
        const analysisResult = await geminiService.analyzeWasteItem(savedData.photo);
        
        console.log('🤖 Gemini analysis result:', analysisResult);
        console.log('🗂️ Will store with category:', category);
        
        // Check if this is a duplicate of the last response
        const isDuplicate = geminiCache.isDuplicate(analysisResult, photoHash);
        
        if (isDuplicate) {
          console.log('🔄 Duplicate response detected - skipping database storage');
          
          // Add analysis result to response but don't store in database
          responseData.aiAnalysis = analysisResult;
          responseData.analysisStatus = 'completed_duplicate';
          responseData.message = 'Analysis completed but duplicate item detected - not stored';
          responseData.category = category; // Include category in response
          
        } else {
          console.log('✨ New unique response - storing in database');
          console.log('💾 Storing with pre-determined category:', category);
          
          // Store the analysis in database with the pre-determined category
          const savedAnalysis = await GeminiResponse.saveAnalysis(
            analysisResult,
            photoHash,
            {
              organic: savedData.organic,
              hazardous: savedData.hazardous,
              recyclable: savedData.recyclable
            },
            JSON.stringify(analysisResult), // Store raw response
            category // Use the pre-determined category from counter changes
          );
          
          console.log('💾 Analysis saved to database with ID:', savedAnalysis._id);
          console.log('🗂️ Confirmed category stored:', savedAnalysis.category);
          
          // Update cache with new response
          geminiCache.updateCache(analysisResult, photoHash);
          
          // Add analysis result to response
          responseData.aiAnalysis = analysisResult;
          responseData.analysisStatus = 'completed';
          responseData.analysisId = savedAnalysis._id;
          responseData.category = category; // Include category in response
        }
        
      } catch (analysisError) {
        console.error('❌ Gemini analysis failed:', analysisError);
        
        // Save failed analysis to database with the pre-determined category
        try {
          const photoHash = generatePhotoHash(savedData.photo);
          console.log('💾 Storing failed analysis with category:', category);
          
          const failedAnalysis = await GeminiResponse.saveFailedAnalysis(
            photoHash,
            {
              organic: savedData.organic,
              hazardous: savedData.hazardous,
              recyclable: savedData.recyclable
            },
            analysisError.message,
            category // Use the pre-determined category
          );
          
          console.log('💾 Failed analysis saved to database with ID:', failedAnalysis._id);
          
          // Include fallback analysis in response
          responseData.aiAnalysis = {
            item: "unidentified object",
            weight_in_grams: 50
          };
          responseData.analysisStatus = 'failed';
          responseData.analysisError = analysisError.message;
          responseData.analysisId = failedAnalysis._id;
          
        } catch (saveError) {
          console.error('❌ Failed to save failed analysis:', saveError);
          responseData.aiAnalysis = {
            item: "unidentified object",
            weight_in_grams: 50
          };
          responseData.analysisStatus = 'failed';
          responseData.analysisError = analysisError.message;
        }
      }
    } else if (savedData.photo && !changeCheck.changes.photo && !changeCheck.changes.organic && !changeCheck.changes.hazardous && !changeCheck.changes.recyclable) {
      console.log('📷 Photo and counter data unchanged - skipping AI analysis');
      responseData.analysisStatus = 'skipped_no_data_changes';
    } else if (!savedData.photo) {
      console.log('📷 No photo provided');
      responseData.analysisStatus = 'no_photo';
    } else {
      console.log('📷 Photo provided but no relevant changes detected');
      responseData.analysisStatus = 'skipped_no_relevant_changes';
    }
    
    res.status(200).json({
      success: true,
      message: (savedData.photo && (changeCheck.changes.photo || changeCheck.changes.organic || changeCheck.changes.hazardous || changeCheck.changes.recyclable)) ? 
        "Bin data received, stored, and analyzed successfully" : 
        "Bin data received and stored successfully",
      data: responseData
    });
    
  } catch (error) {
    console.error('❌ Database error:', error);
    throw new ApiError(500, "Failed to store bin data");
  }
});

// Controller to get the latest bin data
const getLatestBinData = AsyncHandler(async (req, res) => {
  try {
    const latestData = await Bin.getLatestData();
    
    res.status(200).json({
      success: true,
      message: "Latest bin data retrieved successfully",
      data: {
        id: latestData._id,
        organic: latestData.organic,
        hazardous: latestData.hazardous,
        recyclable: latestData.recyclable,
        photoReceived: !!latestData.photo,
        photo: latestData.photo, // Include full photo data if needed
        lastUpdated: latestData.lastUpdated,
        createdAt: latestData.createdAt,
        updatedAt: latestData.updatedAt
      }
    });
    
  } catch (error) {
    console.error('❌ Error getting latest bin data:', error);
    throw new ApiError(500, "Failed to retrieve bin data");
  }
});

// Controller to analyze the latest bin photo using Gemini AI
const analyzeLatestPhoto = AsyncHandler(async (req, res) => {
  try {
    // Get the latest bin data
    const latestData = await Bin.getLatestData();
    
    if (!latestData.photo) {
      throw new ApiError(400, "No photo available in the latest bin data");
    }
    
    console.log('🔍 Analyzing photo with Gemini AI...');
    
    // Initialize Gemini service
    const geminiService = new GeminiService();
    
    // Analyze the photo
    const analysisResult = await geminiService.analyzeWasteItem(latestData.photo);
    
    console.log('✅ Analysis complete:', analysisResult);
    
    res.status(200).json({
      success: true,
      message: "Photo analysis completed successfully",
      data: {
        analysis: analysisResult,
        analyzedAt: new Date().toISOString(),
        binData: {
          id: latestData._id,
          organic: latestData.organic,
          hazardous: latestData.hazardous,
          recyclable: latestData.recyclable,
          lastUpdated: latestData.lastUpdated
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error analyzing photo:', error);
    
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, `Failed to analyze photo: ${error.message}`);
    }
  }
});

// Controller to analyze a specific photo (accepts base64 image in request)
const analyzePhoto = AsyncHandler(async (req, res) => {
  const { photo } = req.body;
  
  if (!photo) {
    throw new ApiError(400, "Photo data is required in request body");
  }
  
  try {
    console.log('🔍 Analyzing provided photo with Gemini AI...');
    
    // Initialize Gemini service
    const geminiService = new GeminiService();
    
    // Analyze the photo
    const analysisResult = await geminiService.analyzeWasteItem(photo);
    
    console.log('✅ Analysis complete:', analysisResult);
    
    res.status(200).json({
      success: true,
      message: "Photo analysis completed successfully",
      data: {
        analysis: analysisResult,
        analyzedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Error analyzing photo:', error);
    throw new ApiError(500, `Failed to analyze photo: ${error.message}`);
  }
});

// Controller to get all Gemini analysis history
const getAnalysisHistory = AsyncHandler(async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const analyses = await GeminiResponse.getAllAnalyses(limit);
    
    res.status(200).json({
      success: true,
      message: `Retrieved ${analyses.length} analysis records`,
      data: {
        analyses: analyses,
        total: analyses.length,
        limit: limit
      }
    });
    
  } catch (error) {
    console.error('❌ Error getting analysis history:', error);
    throw new ApiError(500, "Failed to retrieve analysis history");
  }
});

// Controller to get cache status
const getCacheStatus = AsyncHandler(async (req, res) => {
  try {
    const cacheStatus = geminiCache.getStatus();
    
    res.status(200).json({
      success: true,
      message: "Cache status retrieved successfully",
      data: {
        cache: cacheStatus
      }
    });
    
  } catch (error) {
    console.error('❌ Error getting cache status:', error);
    throw new ApiError(500, "Failed to retrieve cache status");
  }
});

// Controller to clear cache
const clearCache = AsyncHandler(async (req, res) => {
  try {
    geminiCache.clear();
    
    res.status(200).json({
      success: true,
      message: "Cache cleared successfully",
      data: {
        cleared: true,
        clearedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
    throw new ApiError(500, "Failed to clear cache");
  }
});

// Controller to calculate dustbin fill percentages
const getBinFillLevels = AsyncHandler(async (req, res) => {
  try {
    const BIN_CAPACITY = 2000; // grams
    
    console.log('📊 Starting fill level calculation...');
    
    // Use aggregation pipeline for better performance
    const pipeline = [
      { $match: { analysisStatus: 'completed' } },
      { $project: { category: 1, weight_in_grams: 1 } },
      { $limit: 1000 } // Limit for performance
    ];
    
    let analyses;
    try {
      analyses = await GeminiResponse.aggregate(pipeline)
        .option({ maxTimeMS: 5000 }); // 5 second timeout
        
    } catch (dbError) {
      console.error('❌ Database aggregation failed:', dbError);
      
      // Return empty state on timeout
      return res.status(200).json({
        success: true,
        message: "Fill levels calculation (empty state due to database timeout)",
        data: {
          fillPercentages: {
            organic: 0,
            hazardous: 0,
            recyclable: 0
          },
          weights: {
            organic: 0,
            hazardous: 0,
            recyclable: 0
          },
          itemCounts: {
            organic: 0,
            hazardous: 0,
            recyclable: 0
          },
          status: 'timeout',
          calculatedAt: new Date().toISOString()
        }
      });
    }
    
    // Initialize totals for each bin type
    const binTotals = {
      organic: 0,
      hazardous: 0,
      recyclable: 0
    };
    
    // Count items by category
    const itemCounts = {
      organic: 0,
      hazardous: 0,
      recyclable: 0
    };
    
    console.log(`📈 Processing ${analyses.length} analyses...`);
    
    // Sum weights by stored category
    analyses.forEach(analysis => {
      const category = analysis.category || 'organic'; // Default to organic if no category
      const weight = analysis.weight_in_grams || 0;
      
      if (binTotals.hasOwnProperty(category)) {
        binTotals[category] += weight;
        itemCounts[category] += 1;
        console.log(`   Item (${weight}g) → ${category} bin`);
      } else {
        // Fallback for any unexpected categories
        binTotals.organic += weight;
        itemCounts.organic += 1;
        console.log(`   Item (${weight}g) → organic bin (fallback)`);
      }
    });
    
    // Calculate fill percentages
    const fillPercentages = {
      organic: Math.min(Math.round((binTotals.organic / BIN_CAPACITY) * 100), 100),
      hazardous: Math.min(Math.round((binTotals.hazardous / BIN_CAPACITY) * 100), 100),
      recyclable: Math.min(Math.round((binTotals.recyclable / BIN_CAPACITY) * 100), 100)
    };
    
    // Calculate remaining capacity
    const remainingCapacity = {
      organic: Math.max(BIN_CAPACITY - binTotals.organic, 0),
      hazardous: Math.max(BIN_CAPACITY - binTotals.hazardous, 0),
      recyclable: Math.max(BIN_CAPACITY - binTotals.recyclable, 0)
    };
    
    // Determine status for each bin
    const getStatus = (percentage) => {
      if (percentage >= 90) return 'critical';
      if (percentage >= 75) return 'high';
      if (percentage >= 50) return 'medium';
      if (percentage >= 25) return 'low';
      return 'empty';
    };
    
    const binStatus = {
      organic: getStatus(fillPercentages.organic),
      hazardous: getStatus(fillPercentages.hazardous),
      recyclable: getStatus(fillPercentages.recyclable)
    };
    
    console.log('📊 Fill level calculation complete:', fillPercentages);
    
    res.status(200).json({
      success: true,
      message: "Dustbin fill levels calculated successfully",
      data: {
        fillPercentages: fillPercentages,
        fillStatus: binStatus,
        totalWeight: {
          organic: binTotals.organic,
          hazardous: binTotals.hazardous,
          recyclable: binTotals.recyclable
        },
        remainingCapacity: remainingCapacity,
        itemCounts: itemCounts,
        binCapacity: BIN_CAPACITY,
        totalAnalyzedItems: analyses.length,
        calculatedAt: new Date().toISOString(),
        details: {
          organic: {
            fillPercentage: fillPercentages.organic,
            currentWeight: binTotals.organic,
            remainingCapacity: remainingCapacity.organic,
            itemCount: itemCounts.organic,
            status: binStatus.organic
          },
          hazardous: {
            fillPercentage: fillPercentages.hazardous,
            currentWeight: binTotals.hazardous,
            remainingCapacity: remainingCapacity.hazardous,
            itemCount: itemCounts.hazardous,
            status: binStatus.hazardous
          },
          recyclable: {
            fillPercentage: fillPercentages.recyclable,
            currentWeight: binTotals.recyclable,
            remainingCapacity: remainingCapacity.recyclable,
            itemCount: itemCounts.recyclable,
            status: binStatus.recyclable
          }
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error calculating bin fill levels:', error);
    throw new ApiError(500, "Failed to calculate bin fill levels");
  }
});

// Controller to get analysis statistics
const getAnalysisStats = AsyncHandler(async (req, res) => {
  try {
    const analyses = await GeminiResponse.find({});
    
    // Calculate statistics
    const stats = {
      totalAnalyses: analyses.length,
      successfulAnalyses: analyses.filter(a => a.analysisStatus === 'completed').length,
      failedAnalyses: analyses.filter(a => a.analysisStatus === 'failed').length,
      uniqueItems: [...new Set(analyses.filter(a => a.analysisStatus === 'completed').map(a => a.item))],
      averageWeight: 0,
      weightRange: { min: 0, max: 0 },
      recentAnalyses: analyses.slice(0, 10).map(a => ({
        item: a.item,
        weight: a.weight_in_grams,
        status: a.analysisStatus,
        createdAt: a.createdAt
      }))
    };
    
    const successfulAnalyses = analyses.filter(a => a.analysisStatus === 'completed');
    if (successfulAnalyses.length > 0) {
      const weights = successfulAnalyses.map(a => a.weight_in_grams);
      stats.averageWeight = Math.round(weights.reduce((sum, w) => sum + w, 0) / weights.length);
      stats.weightRange.min = Math.min(...weights);
      stats.weightRange.max = Math.max(...weights);
    }
    
    res.status(200).json({
      success: true,
      message: "Analysis statistics retrieved successfully",
      data: stats
    });
    
  } catch (error) {
    console.error('❌ Error getting analysis stats:', error);
    throw new ApiError(500, "Failed to retrieve analysis statistics");
  }
});

// Controller to get basic fill percentages (lightweight version)
const getBasicFillLevels = AsyncHandler(async (req, res) => {
  try {
    const BIN_CAPACITY = 2000; // grams
    
    console.log('📊 Starting basic fill level calculation...');
    
    // Use aggregation pipeline for better performance
    const pipeline = [
      { $match: { analysisStatus: 'completed' } },
      { $project: { category: 1, weight_in_grams: 1 } },
      { $limit: 500 } // Limit for performance
    ];
    
    let analyses;
    try {
      analyses = await GeminiResponse.aggregate(pipeline)
        .option({ maxTimeMS: 3000 }); // 3 second timeout
        
    } catch (dbError) {
      console.error('❌ Database aggregation failed:', dbError);
      
      // Return empty state on timeout
      return res.status(200).json({
        success: true,
        message: "Basic fill levels (empty state due to database timeout)",
        data: {
          organic: 0,
          hazardous: 0,
          recyclable: 0,
          status: 'timeout'
        }
      });
    }
    
    // Initialize totals
    const totals = { organic: 0, hazardous: 0, recyclable: 0 };
    
    // Sum weights by stored category
    analyses.forEach(analysis => {
      const category = analysis.category || 'organic'; // Default to organic if no category
      const weight = analysis.weight_in_grams || 0;
      
      if (totals.hasOwnProperty(category)) {
        totals[category] += weight;
      } else {
        totals.organic += weight; // Fallback
      }
    });
    
    const fillPercentages = {
      organic: Math.min(Math.round((totals.organic / BIN_CAPACITY) * 100), 100),
      hazardous: Math.min(Math.round((totals.hazardous / BIN_CAPACITY) * 100), 100),
      recyclable: Math.min(Math.round((totals.recyclable / BIN_CAPACITY) * 100), 100)
    };
    
    console.log('📊 Basic fill calculation complete:', fillPercentages);
    
    res.status(200).json({
      success: true,
      message: "Basic fill levels calculated successfully",
      data: {
        organic: fillPercentages.organic,
        hazardous: fillPercentages.hazardous,
        recyclable: fillPercentages.recyclable,
        status: 'success',
        itemsAnalyzed: analyses.length,
        calculatedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Error calculating basic fill levels:', error);
    throw new ApiError(500, "Failed to calculate basic fill levels");
  }
});

// Controller to get the 3 latest analyzed items for frontend
const getLatestItems = AsyncHandler(async (req, res) => {
  try {
    console.log('📋 Fetching 3 latest analyzed items...');
    
    // Get the 3 most recent successful analyses (exclude failed ones)
    const latestItems = await GeminiResponse.find({ 
      analysisStatus: 'completed',
      item: { $ne: 'analysis_failed' } // Exclude failed analysis entries
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('item weight_in_grams category createdAt')
      .lean(); // Use lean for better performance
    
    // Format the response for frontend
    const formattedItems = latestItems.map(item => ({
      id: item._id,
      name: item.item,
      weight: item.weight_in_grams,
      category: item.category,
      addedAt: item.createdAt,
      timeAgo: getTimeAgo(item.createdAt)
    }));
    
    console.log(`✅ Retrieved ${formattedItems.length} latest items`);
    
    res.status(200).json({
      success: true,
      message: "Latest items retrieved successfully",
      data: {
        items: formattedItems,
        totalItems: formattedItems.length,
        retrievedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching latest items:', error);
    throw new ApiError(500, "Failed to retrieve latest items");
  }
});

// Helper function to calculate time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }
};

module.exports = {
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
};
