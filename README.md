# GreenPathBookings

A booking management system built for Computer Lab Project assignment.

## Project Structure

- `/backend` - Express.js backend with Prisma ORM and SQLite database
- `/frontend` - Frontend application (to be developed)

## Backend Features

- Express.js server
- SQLite database with Prisma ORM
- JWT authentication
- RESTful API endpoints

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

Frontend development setup instructions will be added later.

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
- `DATABASE_URL` - SQLite database connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `PORT` - Server port (default: 3000)