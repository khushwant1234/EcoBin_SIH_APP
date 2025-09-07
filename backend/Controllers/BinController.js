const { AsyncHandler } = require('../utils/AsyncHandler');
const { ApiError } = require('../utils/ApiError');
const Bin = require('../Models/binModel');
const GeminiResponse = require('../Models/geminiResponseModel');
const GeminiService = require('../utils/GeminiService');
const { generatePhotoHash } = require('../utils/PhotoUtils');

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
      
      try {
        const geminiService = new GeminiService();
        const photoHash = generatePhotoHash(savedData.photo);
        
        console.log('🔍 Generated photo hash:', photoHash);
        
        // Analyze with Gemini
        const analysisResult = await geminiService.analyzeWasteItem(savedData.photo);
        
        console.log('🤖 Gemini analysis result:', analysisResult);
        
        // Store the analysis in database
        const savedAnalysis = await GeminiResponse.saveAnalysis(
          analysisResult,
          photoHash,
          {
            organic: savedData.organic,
            hazardous: savedData.hazardous,
            recyclable: savedData.recyclable
          },
          JSON.stringify(analysisResult) // Store raw response
        );
        
        console.log('💾 Analysis saved to database with ID:', savedAnalysis._id);
        
        // Add analysis result to response
        responseData.aiAnalysis = analysisResult;
        responseData.analysisStatus = 'completed';
        responseData.analysisId = savedAnalysis._id;
        
      } catch (analysisError) {
        console.error('❌ Gemini analysis failed:', analysisError);
        
        // Save failed analysis to database
        try {
          const photoHash = generatePhotoHash(savedData.photo);
          const failedAnalysis = await GeminiResponse.saveFailedAnalysis(
            photoHash,
            {
              organic: savedData.organic,
              hazardous: savedData.hazardous,
              recyclable: savedData.recyclable
            },
            analysisError.message
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

module.exports = {
  submitBinData,
  getLatestBinData,
  analyzeLatestPhoto,
  analyzePhoto,
  getAnalysisHistory,
  getAnalysisStats
};
