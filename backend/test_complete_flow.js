const mongoose = require('mongoose');
require('dotenv').config();

const GeminiResponse = require('./Models/geminiResponseModel');

/**
 * Test script to validate the complete flow:
 * 1. Counter comparison
 * 2. Category determination  
 * 3. Gemini analysis
 * 4. Database storage with category
 * 5. Fill level calculation
 */

async function testCompleteFlow() {
  try {
    console.log('🧪 Testing Complete Bin Submission Flow\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Step 1: Clean existing data for fresh test
    console.log('🧹 Cleaning existing test data...');
    await GeminiResponse.deleteMany({});
    console.log('✅ Database cleaned\n');
    
    // Step 2: Test each bin type with sample data
    const testScenarios = [
      {
        name: 'Organic Bin Test',
        payload: {
          Organic: 1,    // Increment organic
          Hazardous: 0,  
          Recyclable: 0,
          photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        },
        expectedCategory: 'organic'
      },
      {
        name: 'Hazardous Bin Test', 
        payload: {
          Organic: 1,    // Same as before
          Hazardous: 1,  // Increment hazardous
          Recyclable: 0,
          photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwABVgB9JjAZDwAAAABJRU5ErkJggg=="
        },
        expectedCategory: 'hazardous'
      },
      {
        name: 'Recyclable Bin Test',
        payload: {
          Organic: 1,    // Same as before
          Hazardous: 1,  // Same as before  
          Recyclable: 1, // Increment recyclable
          photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADlgGHLjdI9wAAAABJRU5ErkJggg=="
        },
        expectedCategory: 'recyclable'
      }
    ];
    
    // Step 3: Test the submission flow for each scenario
    const axios = require('axios');
    const results = [];
    
    for (const scenario of testScenarios) {
      console.log(`--- ${scenario.name} ---`);
      
      try {
        const response = await axios.post('http://localhost:5000/api/bin/submit', scenario.payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        });
        
        const data = response.data.data;
        
        console.log('✅ Submission Response:');
        console.log(`   Data Changed: ${data.dataChanged}`);
        console.log(`   Expected Category: ${scenario.expectedCategory}`);
        console.log(`   Actual Category: ${data.category || 'Not Set'}`);
        console.log(`   Analysis Status: ${data.analysisStatus}`);
        
        if (data.aiAnalysis) {
          console.log(`   AI Result: ${data.aiAnalysis.item} (${data.aiAnalysis.weight_in_grams}g)`);
        }
        
        results.push({
          scenario: scenario.name,
          success: true,
          expectedCategory: scenario.expectedCategory,
          actualCategory: data.category,
          analysisStatus: data.analysisStatus
        });
        
        console.log('✅ Test passed\n');
        
        // Wait 2 seconds between tests
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Test failed: ${error.message}`);
        results.push({
          scenario: scenario.name,
          success: false,
          error: error.message
        });
      }
    }
    
    // Step 4: Check database records
    console.log('📊 Checking Database Records:');
    console.log('==============================');
    
    const dbRecords = await GeminiResponse.find({})
      .sort({ createdAt: -1 })
      .select('item weight_in_grams category analysisStatus createdAt');
      
    console.log(`Total records: ${dbRecords.length}`);
    
    dbRecords.forEach((record, index) => {
      console.log(`${index + 1}. ${record.item} (${record.weight_in_grams}g) → Category: ${record.category} [${record.analysisStatus}]`);
    });
    
    // Step 5: Test fill level calculation
    console.log('\n📊 Testing Fill Level Calculation:');
    console.log('===================================');
    
    try {
      const fillResponse = await axios.get('http://localhost:5000/api/bin/fill-levels/basic', {
        timeout: 10000
      });
      
      const fillData = fillResponse.data.data;
      
      console.log('Fill Percentages:');
      console.log(`  Organic: ${fillData.organic}%`);
      console.log(`  Hazardous: ${fillData.hazardous}%`);
      console.log(`  Recyclable: ${fillData.recyclable}%`);
      console.log(`  Items Analyzed: ${fillData.itemsAnalyzed}`);
      
    } catch (error) {
      console.error('❌ Fill level calculation failed:', error.message);
    }
    
    // Step 6: Summary
    console.log('\n📋 Test Summary:');
    console.log('================');
    
    const passed = results.filter(r => r.success && r.actualCategory === r.expectedCategory).length;
    const total = results.length;
    
    console.log(`✅ Passed: ${passed}/${total}`);
    
    results.forEach(result => {
      if (result.success) {
        const status = result.actualCategory === result.expectedCategory ? '✅' : '❌';
        console.log(`${status} ${result.scenario}: Expected ${result.expectedCategory}, Got ${result.actualCategory}`);
      } else {
        console.log(`❌ ${result.scenario}: ${result.error}`);
      }
    });
    
    if (passed === total) {
      console.log('\n🎉 All tests passed! The complete flow is working correctly.');
    } else {
      console.log('\n⚠️ Some tests failed. Please check the implementation.');
    }
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const axios = require('axios');
    await axios.get('http://localhost:5000/api/bin/cache/status', { timeout: 5000 });
    console.log('✅ Server is running on port 5000\n');
    return true;
  } catch (error) {
    console.error('❌ Server is not running on port 5000');
    console.error('Please start the server with: npm run dev');
    return false;
  }
}

// Main execution
if (require.main === module) {
  checkServer()
    .then(serverRunning => {
      if (serverRunning) {
        return testCompleteFlow();
      } else {
        process.exit(1);
      }
    })
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { testCompleteFlow };
