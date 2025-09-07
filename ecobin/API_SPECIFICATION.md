# Authentication API Specification

## Login Endpoint

### Request

**Method:** `POST`  
**URL:** `/api/auth/login`  
**Content-Type:** `application/json`

**Payload:**

```json
{
  "email": "john.doe@example.com",
  "password": "your_secure_password123"
}
```

### Response

**Success Response:**

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

**Error Response:**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## Registration Endpoint

### Request

**Method:** `POST`  
**URL:** `/api/auth/register`  
**Content-Type:** `application/json`

**Payload:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "your_secure_password123",
  "role": "household"
}
```

### Response

**Success Response:**

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

**Error Response:**

```json
{
  "success": false,
  "message": "Email already exists"
}
```

## Key Differences

1. **Login Response**: Does NOT include a `message` field
2. **Registration Response**: Includes a `message` field
3. **Both**: Include `success`, `data.token`, and `data.user`
4. **Role**: Must be either "household" or "municipality"

## Frontend Implementation Notes

- ✅ Login form uses email + password
- ✅ Registration form uses name + email + password + role
- ✅ Proper TypeScript interfaces defined
- ✅ Handles both response formats correctly
- ✅ Token storage after successful authentication
- ✅ Error handling for failed requests
