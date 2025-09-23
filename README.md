# GreenPathBookings

A comprehensive tour booking management system built for M607 Computer Lab Project assignment.

## Project Structure

- `/backend` - Express.js REST API server with comprehensive booking and tour management
- `/frontend` - React Web App with Material-UI and PayPal integration

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with bcryptjs for password hashing
- **Security**: Helmet for security headers, CORS for cross-origin requests
- **Logging**: Morgan for HTTP request logging
- **Development**: Nodemon for auto-restart

### Frontend
- **Framework**: React 19.1.1 with React Router DOM 7.9.1
- **UI Library**: Material-UI (MUI) 7.3.2
- **Payment**: PayPal React SDK 8.9.1
- **Data Visualization**: Plotly.js with React integration
- **HTTP Client**: Axios for API communication

## Features

### User Management
- User registration and login with JWT authentication
- Role-based access control (USER/ADMIN roles)
- Secure password hashing with bcryptjs
- Protected routes for authenticated users

### Tour Management
- Complete CRUD operations for tours
- Tour availability and capacity management
- Image upload support for tours
- Active/inactive tour status
- Date-based tour scheduling

### Booking System
- Real-time availability checking
- Multi-person booking support
- Booking status tracking (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- Payment integration with booking confirmation
- User booking history

### Payment Processing
- PayPal integration for secure payments
- Payment status tracking and validation
- Payment method recording
- Transaction ID storage

### Admin Panel
- Comprehensive dashboard with analytics
- User management and statistics
- Tour creation and management
- Booking oversight and status updates
- Data visualization with interactive charts
- Real-time metrics and reporting

### API Features
- RESTful API design with proper HTTP status codes
- Comprehensive error handling and validation
- CORS support for cross-origin requests
- Security headers with Helmet
- Request logging and monitoring
- Database seeding and verification scripts

### Frontend Features
- Responsive Material Design interface
- Authentication flow with protected routes
- Tour browsing and filtering
- Interactive booking process
- Payment integration
- User dashboard for booking management
- Admin panel for system management
- Real-time data visualization

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

3. Set up environment variables:
   Create a `.env` file with:
   ```
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="your-secret-key"
   PORT=3000
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Seed the database (optional because the database is already pushed with code):
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with:
   ```
   VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
   VITE_PAYPAL_CLIENT_SECRET=your-paypal-client-id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Tours
- `GET /api/tours` - Get all tours (with filtering)
- `POST /api/tours` - Create tour (admin only)
- `PUT /api/tours/:id` - Update tour (admin only)
- `DELETE /api/tours/:id` - Delete tour (admin only)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status
- `GET /api/bookings/admin` - Get all bookings (admin only)

## Database Schema

The application uses SQLite with Prisma ORM featuring:
- **Users** - Authentication and role management
- **Tours** - Tour information and scheduling
- **Bookings** - Booking records with payment tracking

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - SQLite database connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

### Frontend (.env)
- `VITE_API_URL` - Backend API base URL
- `VITE_PAYPAL_CLIENT_ID` - PayPal client ID for payments
