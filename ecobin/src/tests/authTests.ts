// Test utilities for authentication flow

import { PostApiCall } from "../utils/apiCall";
import type { RegistrationRequest, LoginRequest, RegistrationResponse, LoginResponse } from "../types/api";

// Test configuration
const TEST_CONFIG = {
  backendUrl: "http://localhost:5000",
  testUser: {
    name: "Test User",
    email: "test@example.com",
    password: "testpassword123",
    role: "household" as const
  }
};

// Test registration
export const testRegistration = async (): Promise<void> => {
  console.log("🧪 Testing Registration...");
  
  const registrationData: RegistrationRequest = {
    name: TEST_CONFIG.testUser.name,
    email: TEST_CONFIG.testUser.email,
    password: TEST_CONFIG.testUser.password,
    role: TEST_CONFIG.testUser.role
  };

  try {
    const response = await PostApiCall(
      `${TEST_CONFIG.backendUrl}/api/auth/register`,
      registrationData
    ) as RegistrationResponse;

    console.log("✅ Registration successful:", response);
    
    // Validate response structure
    if (response.success && response.data.token && response.data.user) {
      console.log("✅ Response structure is correct");
      console.log("📧 User email:", response.data.user.email);
      console.log("👤 User role:", response.data.user.role);
      console.log("🔑 Token received:", response.data.token.substring(0, 20) + "...");
    } else {
      console.error("❌ Response structure is invalid");
    }
  } catch (error) {
    console.error("❌ Registration failed:", error);
  }
};

// Test login
export const testLogin = async (): Promise<void> => {
  console.log("🧪 Testing Login...");
  
  const loginData: LoginRequest = {
    email: TEST_CONFIG.testUser.email,
    password: TEST_CONFIG.testUser.password
  };

  try {
    const response = await PostApiCall(
      `${TEST_CONFIG.backendUrl}/api/auth/login`,
      loginData
    ) as LoginResponse;

    console.log("✅ Login successful:", response);
    
    // Validate response structure
    if (response.success && response.data.token && response.data.user) {
      console.log("✅ Response structure is correct");
      console.log("📧 User email:", response.data.user.email);
      console.log("👤 User role:", response.data.user.role);
      console.log("🔑 Token received:", response.data.token.substring(0, 20) + "...");
      
      // Note: Login response doesn't have message field
      if (!('message' in response)) {
        console.log("✅ Login response format is correct (no message field)");
      }
    } else {
      console.error("❌ Response structure is invalid");
    }
  } catch (error) {
    console.error("❌ Login failed:", error);
  }
};

// Test full authentication flow
export const testAuthFlow = async (): Promise<void> => {
  console.log("🚀 Starting full authentication flow test...");
  
  // Test registration first
  await testRegistration();
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test login
  await testLogin();
  
  console.log("✅ Authentication flow test completed");
};

// Validate payload structure
export const validatePayloads = (): void => {
  console.log("🔍 Validating payload structures...");
  
  const registrationPayload: RegistrationRequest = {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "your_secure_password123",
    role: "household"
  };
  
  const loginPayload: LoginRequest = {
    email: "john.doe@example.com",
    password: "your_secure_password123"
  };
  
  console.log("📝 Registration payload:", registrationPayload);
  console.log("📝 Login payload:", loginPayload);
  
  // Validate required fields
  const registrationFields = ['name', 'email', 'password', 'role'];
  const loginFields = ['email', 'password'];
  
  const hasAllRegistrationFields = registrationFields.every(field => 
    field in registrationPayload && registrationPayload[field as keyof RegistrationRequest]
  );
  
  const hasAllLoginFields = loginFields.every(field => 
    field in loginPayload && loginPayload[field as keyof LoginRequest]
  );
  
  console.log(hasAllRegistrationFields ? "✅ Registration payload is valid" : "❌ Registration payload is missing fields");
  console.log(hasAllLoginFields ? "✅ Login payload is valid" : "❌ Login payload is missing fields");
};

// Example usage in browser console:
// import { testAuthFlow, validatePayloads } from './path/to/this/file';
// validatePayloads();
// testAuthFlow();
