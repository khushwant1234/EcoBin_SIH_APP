// Example payloads for testing the authentication API

// Registration payload example
export const sampleRegistrationPayload = {
  name: "John Doe",
  email: "john.doe@example.com",
  password: "your_secure_password123",
  role: "household"
};

// Login payload example
export const sampleLoginPayload = {
  email: "john.doe@example.com",
  password: "your_secure_password123"
};

// Expected successful registration response
export const expectedRegistrationResponse = {
  success: true,
  message: "Registration successful! You can now log in.",
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      id: "64f7a1b2c3d4e5f6a7b8c9d0",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "household",
      isEmailVerified: true
    }
  }
};

// Expected successful login response
export const expectedLoginResponse = {
  success: true,
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      id: "64f7a1b2c3d4e5f6a7b8c9d0",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "household",
      isEmailVerified: true
    }
  }
};
