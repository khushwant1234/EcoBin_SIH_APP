const { AsyncHandler } = require('../utils/AsyncHandler');
const { ApiError } = require('../utils/ApiError');
const Bin = require('../Models/binModel');

// Controller to handle bin data submission
const submitBinData = AsyncHandler(async (req, res) => {
  const { bin1, bin2, bin3, photo } = req.body;
  
  // Log the received data
  console.log('=== Received Bin Data ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Bin 1:', bin1);
  console.log('Bin 2:', bin2);
  console.log('Bin 3:', bin3);
  console.log('Photo length:', photo ? photo.length : 'No photo provided');
  console.log('Full payload:', req.body);
  console.log('========================');
  
  // Prepare data for storage (only include provided fields)
  const binData = {};
  if (bin1 !== undefined) binData.bin1 = String(bin1);
  if (bin2 !== undefined) binData.bin2 = String(bin2);
  if (bin3 !== undefined) binData.bin3 = String(bin3);
  if (photo !== undefined) binData.photo = photo;
  
  try {
    // Update/create the latest bin data (overwrites previous data)
    const savedData = await Bin.updateLatestData(binData);
    
    console.log('✅ Data saved to database:', savedData._id);
    
    res.status(200).json({
      success: true,
      message: "Bin data received and stored successfully",
      data: {
        id: savedData._id,
        bin1: savedData.bin1,
        bin2: savedData.bin2,
        bin3: savedData.bin3,
        photoReceived: !!savedData.photo,
        lastUpdated: savedData.lastUpdated,
        timestamp: new Date().toISOString()
      }
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
        bin1: latestData.bin1,
        bin2: latestData.bin2,
        bin3: latestData.bin3,
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

module.exports = {
  submitBinData,
  getLatestBinData
};
