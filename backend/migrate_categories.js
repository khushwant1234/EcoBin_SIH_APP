const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import models
const GeminiResponse = require('./Models/geminiResponseModel');

/**
 * Migration script to fix records missing category field
 */
async function fixMissingCategories() {
  try {
    console.log('🔧 Starting category migration...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Find records without category or with null category
    const recordsToFix = await GeminiResponse.find({
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: undefined },
        { category: '' }
      ],
      analysisStatus: 'completed'
    });
    
    console.log(`📊 Found ${recordsToFix.length} records to fix\n`);
    
    if (recordsToFix.length === 0) {
      console.log('✅ No records need fixing!');
      return;
    }
    
    let fixCount = 0;
    
    for (const record of recordsToFix) {
      try {
        // Smart categorization based on item name
        let category = 'organic'; // default
        
        const item = (record.item || '').toLowerCase();
        
        // Hazardous items
        if (item.includes('battery') || 
            item.includes('chemical') || 
            item.includes('electronic') ||
            item.includes('paint') ||
            item.includes('oil') ||
            item.includes('medicine') ||
            item.includes('toxic')) {
          category = 'hazardous';
        }
        // Recyclable items  
        else if (item.includes('bottle') ||
                 item.includes('can') ||
                 item.includes('plastic') ||
                 item.includes('paper') ||
                 item.includes('cardboard') ||
                 item.includes('glass') ||
                 item.includes('metal') ||
                 item.includes('aluminum')) {
          category = 'recyclable';
        }
        // Organic items (default)
        else if (item.includes('apple') ||
                 item.includes('banana') ||
                 item.includes('fruit') ||
                 item.includes('food') ||
                 item.includes('organic') ||
                 item.includes('peel') ||
                 item.includes('vegetable')) {
          category = 'organic';
        }
        
        // Update the record
        await GeminiResponse.updateOne(
          { _id: record._id },
          { $set: { category: category } }
        );
        
        console.log(`✅ Fixed: ${record.item} → ${category}`);
        fixCount++;
        
      } catch (error) {
        console.error(`❌ Failed to fix record ${record._id}:`, error.message);
      }
    }
    
    console.log(`\n✅ Successfully fixed ${fixCount} out of ${recordsToFix.length} records`);
    
    // Verify the fix
    console.log('\n🔍 Verification:');
    const remainingUnfixed = await GeminiResponse.countDocuments({
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: undefined },
        { category: '' }
      ],
      analysisStatus: 'completed'
    });
    
    console.log(`📊 Records still without category: ${remainingUnfixed}`);
    
    // Show new distribution
    const newCategoryStats = await GeminiResponse.aggregate([
      { $match: { analysisStatus: 'completed' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalWeight: { $sum: '$weight_in_grams' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 New Category Distribution:');
    newCategoryStats.forEach(stat => {
      const category = stat._id || 'undefined/null';
      console.log(`  ${category}: ${stat.count} items (${stat.totalWeight}g)`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the migration
if (require.main === module) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('⚠️  This will update existing database records with category information.');
  console.log('This is a one-time migration to fix records missing the category field.\n');
  
  rl.question('Are you sure you want to proceed? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      rl.close();
      fixMissingCategories()
        .then(() => process.exit(0))
        .catch(error => {
          console.error('Fatal error:', error);
          process.exit(1);
        });
    } else {
      console.log('❌ Migration cancelled');
      rl.close();
      process.exit(0);
    }
  });
}

module.exports = { fixMissingCategories };
