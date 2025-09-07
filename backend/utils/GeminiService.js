const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  /**
   * Analyze image to identify the largest object and estimate its weight
   * @param {string} base64Image - Base64 encoded image
   * @returns {Promise<{item: string, weight_in_grams: number}>}
   */
  async analyzeWasteItem(base64Image) {
    try {
      // Remove data URL prefix if present
      const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
      
      const prompt = `
        Analyze this image and identify the largest/main object visible. 
        
        Instructions:
        1. Look at the image and identify the most prominent/largest object
        2. Determine what type of item it is (e.g., apple, bottle, can, etc.)
        3. Estimate the weight of that specific object in grams
        4. Be as accurate as possible with weight estimation based on typical sizes
        5. Focus on waste/recyclable items if multiple objects are present
        
        Return ONLY a valid JSON object in this exact format:
        {"item": "object_name", "weight_in_grams": number}
        
        Examples:
        - For a plastic water bottle: {"item": "plastic bottle", "weight_in_grams": 25}
        - For an apple: {"item": "apple", "weight_in_grams": 180}
        - For a soda can: {"item": "aluminum can", "weight_in_grams": 15}
        
        Do not include any explanation, only return the JSON object.
      `;

      const imagePart = {
        inlineData: {
          data: cleanBase64,
          mimeType: "image/jpeg"
        }
      };

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      console.log('🤖 Gemini raw response:', text);
      
      // Try to parse the JSON response
      try {
        // Clean the response text (remove any extra text around JSON)
        const jsonMatch = text.match(/\{[^}]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON object found in response');
        }
        
        const jsonResponse = JSON.parse(jsonMatch[0]);
        
        // Validate the response structure
        if (!jsonResponse.item || typeof jsonResponse.weight_in_grams !== 'number') {
          throw new Error('Invalid response structure');
        }
        
        console.log('✅ Parsed Gemini response:', jsonResponse);
        return jsonResponse;
        
      } catch (parseError) {
        console.error('❌ Failed to parse Gemini response:', parseError);
        
        // Return a fallback response
        return {
          item: "unidentified object",
          weight_in_grams: 50
        };
      }
      
    } catch (error) {
      console.error('❌ Gemini API error:', error);
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
  }

  /**
   * Test the Gemini API connection
   */
  async testConnection() {
    try {
      const result = await this.model.generateContent("Hello! Please respond with just 'OK' if you can read this.");
      const response = await result.response;
      const text = response.text();
      
      console.log('🧪 Gemini test response:', text);
      return text.toLowerCase().includes('ok');
      
    } catch (error) {
      console.error('❌ Gemini connection test failed:', error);
      return false;
    }
  }
}

module.exports = GeminiService;
