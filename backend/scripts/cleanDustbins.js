const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Import models
const GeminiResponse = require('../Models/geminiResponseModel');

/**
 * Clean all dustbin items (remove all analysis records)
 */
async function cleanAllItems() {
  try {
    console.log('🧹 Starting cleanup of all dustbin items...');
    
    // Check if MongoDB URI is available
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI environment variable is not set!');
      console.log('Please make sure your .env file contains MONGO_URI=your_mongodb_connection_string');
      process.exit(1);
    }
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get count before deletion
    const totalCount = await GeminiResponse.countDocuments({});
    console.log(`📊 Total items to clean: ${totalCount}`);
    
    if (totalCount === 0) {
      console.log('✨ No items to clean - dustbins are already empty!');
      return;
    }
    
    // Delete all analysis records
    const deleteResult = await GeminiResponse.deleteMany({});
    
    console.log(`🗑️ Successfully deleted ${deleteResult.deletedCount} items`);
    console.log('✨ All dustbins are now clean!');
    
    // Verify cleanup
    const remainingCount = await GeminiResponse.countDocuments({});
    console.log(`📊 Remaining items: ${remainingCount}`);
    
    if (remainingCount === 0) {
      console.log('✅ Cleanup completed successfully!');
    } else {
      console.log('⚠️ Some items may not have been deleted. Please check manually.');
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

/**
 * Clean items with confirmation prompt
 */
async function cleanWithConfirmation() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI environment variable is not set!');
      console.log('Please make sure your .env file contains MONGO_URI=your_mongodb_connection_string');
      rl.close();
      process.exit(1);
    }
    
    // Connect to MongoDB to get item count
    await mongoose.connect(process.env.MONGO_URI);
    const totalCount = await GeminiResponse.countDocuments({});
    
    if (totalCount === 0) {
      console.log('✨ No items to clean - dustbins are already empty!');
      rl.close();
      await mongoose.connection.close();
      process.exit(0);
    }
    
    console.log(`⚠️  WARNING: This will delete ALL ${totalCount} items from all dustbins!`);
    console.log('This action cannot be undone.');
    
    rl.question('Are you sure you want to proceed? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        rl.close();
        await cleanAllItems();
      } else {
        console.log('❌ Cleanup cancelled');
        rl.close();
        await mongoose.connection.close();
        process.exit(0);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    rl.close();
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Check command line arguments
const args = process.argv.slice(2);

if (args.includes('--force') || args.includes('-f')) {
  // Force cleanup without confirmation
  cleanAllItems();
} else if (args.includes('--help') || args.includes('-h')) {
  // Show help
  console.log('🧹 Dustbin Cleaner Script');
  console.log('');
  console.log('Usage:');
  console.log('  node cleanDustbins.js           # Clean with confirmation prompt');
  console.log('  node cleanDustbins.js --force   # Clean without confirmation');
  console.log('  node cleanDustbins.js --help    # Show this help');
  console.log('');
  console.log('This script will remove ALL analyzed items from all dustbins.');
  console.log('Use with caution as this action cannot be undone!');
} else {
  // Default: clean with confirmation
  cleanWithConfirmation();
}