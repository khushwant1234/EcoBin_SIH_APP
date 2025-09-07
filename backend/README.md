# latest_app Backend

Express.js backend with MongoDB and JWT authentication, following a modular structure.

## Structure

- Config: Database configuration
- Controllers: Route logic and business logic
- Middlewares: Authentication and authorization middlewares
- Models: Mongoose models with validation
- Routes: Express routers
- api: API entry point
- utils: Utility functions (JWT, error handling, async wrapper)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your `.env` file with the following variables:
   ```
   MONGO_URI=mongodb://localhost:27017/latest_app
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   JWT_EXPIRES_IN=30d
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login user
- `GET /api/auth/me` — Get current user profile (protected)
- `GET /api/auth/verify-email/:token` — Verify email address
- `POST /api/auth/resend-verification` — Resend verification email
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password/:token` — Reset password with token
- `GET /api/auth/verify-reset-token/:token` — Verify reset token validity

### User Endpoints (Protected)

- `GET /api/users` — List all users (municipality_admin only)
- `GET /api/users/:id` — Get user by ID (municipality_admin only)
- `PATCH /api/users/profile` — Update current user profile
- `DELETE /api/users/:id` — Delete user (municipality_admin only)

### Other Endpoints

- `GET /health` — Health check endpoint

## User Roles

- **household**: Regular user with basic access
- **municipality_admin**: Administrative user with full access

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and error messages.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Email verification
- Password reset functionality
- Input validation with Mongoose
