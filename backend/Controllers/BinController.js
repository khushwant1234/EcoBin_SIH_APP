const { AsyncHandler } = require('../utils/AsyncHandler');
const { ApiError } = require('../utils/ApiError');
const Bin = require('../Models/binModel');
const GeminiService = require('../utils/GeminiService');

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
      timestamp: new Date().toISOString()
    };
    
    // If photo is included, automatically analyze it with Gemini AI
    if (savedData.photo) {
      console.log('📸 Photo detected, analyzing with Gemini AI...');
      
      try {
        const geminiService = new GeminiService();
        const analysisResult = await geminiService.analyzeWasteItem(savedData.photo);
        
        console.log('🤖 Gemini analysis result:', analysisResult);
        
        // Add analysis result to response
        responseData.aiAnalysis = analysisResult;
        responseData.analysisStatus = 'completed';
        
      } catch (analysisError) {
        console.error('❌ Gemini analysis failed:', analysisError);
        
        // Include fallback analysis in response
        responseData.aiAnalysis = {
          item: "unidentified object",
          weight_in_grams: 50
        };
        responseData.analysisStatus = 'failed';
        responseData.analysisError = analysisError.message;
      }
    } else {
      responseData.analysisStatus = 'no_photo';
    }
    
    res.status(200).json({
      success: true,
      message: savedData.photo ? 
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

module.exports = {
  submitBinData,
  getLatestBinData,
  analyzeLatestPhoto,
  analyzePhoto
};
