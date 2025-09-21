# GreenPathBookings Backend

Express.js backend API with Prisma ORM, SQLite database, and JWT authentication.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env` and update values
   - The database URL is already configured for SQLite

3. Initialize database:
   ```bash
   npx prisma migrate dev
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

The server will start on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings` - Get bookings (protected)
- `GET /api/bookings/:id` - Get booking by ID (protected)
- `PUT /api/bookings/:id` - Update booking (protected)
- `DELETE /api/bookings/:id` - Delete booking (protected)

## Database Schema

### User
- id (Int, Primary Key)
- email (String, Unique)
- password (String, Hashed)
- firstName (String)
- lastName (String)
- role (UserRole: USER | ADMIN)
- createdAt (DateTime)
- updatedAt (DateTime)

### Booking
- id (Int, Primary Key)
- userId (Int, Foreign Key)
- title (String)
- description (String, Optional)
- startDate (DateTime)
- endDate (DateTime)
- status (BookingStatus: PENDING | CONFIRMED | CANCELLED | COMPLETED)
- createdAt (DateTime)
- updatedAt (DateTime)

## Development

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Create and apply new migration