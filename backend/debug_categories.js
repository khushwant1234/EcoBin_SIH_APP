const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import models
const GeminiResponse = require('./Models/geminiResponseModel');

/**
 * Debug script to check category distribution in database
 */
async function debugCategoryDistribution() {
  try {
    console.log('🔍 Analyzing category distribution in database...\n');
    
    // Check if MongoDB URI is available
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI environment variable is not set!');
      return;
    }
    console.log('✅ MONGO_URI found');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Get total count
    const totalCount = await GeminiResponse.countDocuments({});
    console.log(`📊 Total analysis records: ${totalCount}\n`);
    
    if (totalCount === 0) {
      console.log('❌ No records found in database');
      return;
    }
    
    // Check category field existence and distribution
    console.log('📋 Category Distribution:');
    console.log('========================');
    
    // Count by category
    const categoryStats = await GeminiResponse.aggregate([
      { $match: { analysisStatus: 'completed' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalWeight: { $sum: '$weight_in_grams' },
          avgWeight: { $avg: '$weight_in_grams' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    categoryStats.forEach(stat => {
      const category = stat._id || 'undefined/null';
      console.log(`${category}:`);
      console.log(`  Count: ${stat.count}`);
      console.log(`  Total Weight: ${stat.totalWeight}g`);
      console.log(`  Average Weight: ${Math.round(stat.avgWeight)}g`);
      console.log('');
    });
    
    // Check for records without category field
    const noCategoryCount = await GeminiResponse.countDocuments({ 
      category: { $exists: false },
      analysisStatus: 'completed'
    });
    console.log(`📝 Records without category field: ${noCategoryCount}`);
    
    // Check for null/undefined categories
    const nullCategoryCount = await GeminiResponse.countDocuments({ 
      $or: [
        { category: null },
        { category: undefined },
        { category: '' }
      ],
      analysisStatus: 'completed'
    });
    console.log(`📝 Records with null/empty category: ${nullCategoryCount}`);
    
    // Show recent 10 records with their categories
    console.log('\n📋 Recent 10 Records:');
    console.log('=====================');
    const recentRecords = await GeminiResponse.find({ analysisStatus: 'completed' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('item weight_in_grams category createdAt')
      .lean();
      
    recentRecords.forEach((record, index) => {
      console.log(`${index + 1}. ${record.item} (${record.weight_in_grams}g) → Category: ${record.category || 'NOT SET'}`);
    });
    
    // Calculate what fill levels would be with current data
    console.log('\n📊 Current Fill Level Calculation:');
    console.log('==================================');
    
    const BIN_CAPACITY = 2000;
    const totals = { organic: 0, hazardous: 0, recyclable: 0 };
    
    const allCompleted = await GeminiResponse.find({ analysisStatus: 'completed' })
      .select('category weight_in_grams')
      .lean();
      
    allCompleted.forEach(record => {
      const category = record.category || 'organic'; // Default like the actual function
      const weight = record.weight_in_grams || 0;
      
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
    
    console.log('Fill Percentages:');
    console.log(`  Organic: ${fillPercentages.organic}% (${totals.organic}g)`);
    console.log(`  Hazardous: ${fillPercentages.hazardous}% (${totals.hazardous}g)`);
    console.log(`  Recyclable: ${fillPercentages.recyclable}% (${totals.recyclable}g)`);
    
    // Suggest fixes
    console.log('\n💡 Suggestions:');
    console.log('===============');
    
    if (noCategoryCount > 0 || nullCategoryCount > 0) {
      console.log('❌ Some records are missing category information');
      console.log('🔧 Consider running a migration script to fix old records');
    }
    
    if (categoryStats.length === 1 && categoryStats[0]._id === 'organic') {
      console.log('❌ All records have category "organic"');
      console.log('🔧 Check if determineCategoryFromChanges function is working correctly');
      console.log('🔧 Verify that counter changes are being detected properly');
    }
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the debug analysis
if (require.main === module) {
  debugCategoryDistribution()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { debugCategoryDistribution };
