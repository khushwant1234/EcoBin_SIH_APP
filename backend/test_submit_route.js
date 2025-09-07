const axios = require('axios');
const fs = require('fs');

// Test the /submit route with sample data
async function testSubmitRoute() {
  try {
    console.log('🧪 Testing /submit route...');
    
    // Sample base64 image (1x1 pixel PNG for testing)
    const sampleBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
    
    // Test payload from Flask server
    const testPayload = {
      Organic: 5,      // Uppercase format from Flask
      Hazardous: 2,
      Recyclable: 8,
      photo: sampleBase64
    };
    
    console.log('📤 Sending test payload:', {
      Organic: testPayload.Organic,
      Hazardous: testPayload.Hazardous,
      Recyclable: testPayload.Recyclable,
      photoLength: testPayload.photo.length
    });
    
    // Make request to submit endpoint
    const response = await axios.post('http://localhost:5000/api/bin/submit', testPayload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout for Gemini API
    });
    
    console.log('✅ Response received:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
    // Check if the response contains expected fields
    const data = response.data.data;
    if (data) {
      console.log('\n📊 Verification:');
      console.log('✓ Counter values stored:', {
        organic: data.organic,
        hazardous: data.hazardous,
        recyclable: data.recyclable
      });
      console.log('✓ Photo received:', data.photoReceived);
      console.log('✓ Data changed:', data.dataChanged);
      
      if (data.aiAnalysis) {
        console.log('✓ AI Analysis:', {
          item: data.aiAnalysis.item,
          weight: data.aiAnalysis.weight_in_grams,
          category: data.category || 'Not specified'
        });
      }
      
      if (data.analysisStatus) {
        console.log('✓ Analysis status:', data.analysisStatus);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Test with different counter scenarios
async function testDifferentScenarios() {
  console.log('\n🔄 Testing different scenarios...\n');
  
  // Scenario 1: Only organic counter changed
  console.log('--- Scenario 1: Organic bin used ---');
  await testScenario({
    Organic: 6,    // Increment by 1
    Hazardous: 2,  // Same
    Recyclable: 8, // Same
    photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
  
  // Scenario 2: Only hazardous counter changed
  console.log('\n--- Scenario 2: Hazardous bin used ---');
  await testScenario({
    Organic: 6,    // Same
    Hazardous: 3,  // Increment by 1
    Recyclable: 8, // Same
    photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwABVgB9JjAZDwAAAABJRU5ErkJggg=="
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
  
  // Scenario 3: Only recyclable counter changed
  console.log('\n--- Scenario 3: Recyclable bin used ---');
  await testScenario({
    Organic: 6,    // Same
    Hazardous: 3,  // Same
    Recyclable: 9, // Increment by 1
    photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADlgGHLjdI9wAAAABJRU5ErkJggg=="
  });
}

async function testScenario(payload) {
  try {
    const response = await axios.post('http://localhost:5000/api/bin/submit', payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });
    
    const data = response.data.data;
    console.log('✅ Response:', {
      counters: { organic: data.organic, hazardous: data.hazardous, recyclable: data.recyclable },
      dataChanged: data.dataChanged,
      category: data.category || 'Not specified',
      analysisStatus: data.analysisStatus
    });
    
  } catch (error) {
    console.error('❌ Scenario failed:', error.message);
  }
}

// Main execution
if (require.main === module) {
  console.log('🚀 Starting Submit Route Test\n');
  
  // First, test basic functionality
  testSubmitRoute()
    .then(() => {
      console.log('\n🔄 Basic test completed. Starting scenario tests...');
      return testDifferentScenarios();
    })
    .then(() => {
      console.log('\n✅ All tests completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = { testSubmitRoute, testDifferentScenarios };
