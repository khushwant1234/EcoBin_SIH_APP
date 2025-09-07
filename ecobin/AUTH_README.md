# EcoBin Authentication Setup

## Overview
This project includes a complete authentication system with TypeScript support for both web applications and Chrome extensions.

## Features

### 🔐 Authentication Components
- **Login/Signup Form**: Modern UI with role-based registration
- **Token Management**: Secure storage with Chrome extension and localStorage fallback
- **API Integration**: Complete API client with error handling

### 📝 Form Fields

#### Registration
- **Name**: User's full name
- **Email**: User's email address (used for login)
- **Role**: Either "household" or "municipality" 
- **Password**: Minimum 6 characters

#### Login
- **Email**: User's email address
- **Password**: User's password

## API Endpoints

### Registration
```
POST /api/auth/register
```

**Payload:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com", 
  "password": "your_secure_password123",
  "role": "household"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful! You can now log in.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f7a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "household",
      "isEmailVerified": true
    }
  }
}
```

### Login
```
POST /api/auth/login
```

**Payload:**
```json
{
  "email": "john.doe@example.com",
  "password": "your_secure_password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f7a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "household",
      "isEmailVerified": true
    }
  }
}
```

## File Structure

```
src/
├── Pages/
│   ├── Auth.tsx              # Authentication component
│   └── Home.tsx              # Home page with auth status
├── utils/
│   ├── apiCall.ts            # API client utilities
│   └── storage.ts            # Storage utilities (Chrome + localStorage)
├── services/
│   ├── user-service.ts       # User management services
│   └── utils.ts              # Service utilities
├── scripts/
│   └── user-utils.ts         # Chrome extension utilities
├── config/
│   └── constants.ts          # Configuration constants
├── Components/
│   ├── Loading.tsx           # Loading component
│   └── PageNotFound.tsx      # 404 component
└── examples/
    └── sampleData.ts         # Example payloads and responses
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

## Usage

### Starting the Application
```bash
npm run dev
```

### Navigation
- **Home Page**: `/` - Shows authentication status
- **Auth Page**: `/auth` - Login/Signup forms

### Testing Authentication
1. Navigate to `/auth`
2. Switch between Login/Signup tabs
3. Fill in the required fields
4. Submit the form
5. Check console for API calls and responses

## Components

### Auth Component (`/auth`)
- Responsive design with tabbed interface
- Form validation and error handling
- Toast notifications for user feedback
- Automatic redirect after successful authentication

### Home Component (`/`)
- Authentication status display
- Login/Logout buttons
- Protected content when authenticated

## Storage Support

The application supports both:
- **Chrome Extension Storage**: For browser extension environments
- **localStorage**: For regular web applications

## API Client Features

- **Automatic token management**
- **Error handling with user feedback**
- **Support for all HTTP methods** (GET, POST, PUT, DELETE)
- **Chrome extension compatibility**

## Development Notes

- All files are written in TypeScript for type safety
- Components use modern React hooks
- Responsive design with Tailwind CSS
- Toast notifications for user feedback
- Proper error handling and loading states
