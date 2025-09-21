# Database Seeding Guide

This guide explains how to seed the GreenPathBookings database with realistic tour data.

## What the Seed Script Does

The seed script (`prisma/seed.js`) populates your database with:

- **15 Realistic Eco-Tours**: Conservation and sustainable travel experiences around the world
- **5 Test Users**: Including 1 admin and 4 regular users
- **6 Sample Bookings**: Various booking statuses for testing

## Tours Included

The seed data includes diverse eco-friendly tours such as:
- Amazon Rainforest Conservation Experience
- Costa Rica Wildlife Sanctuary Volunteer Tour
- Arctic Climate Research Expedition
- Galápagos Marine Conservation Adventure
- Himalayan Sustainable Trekking Experience
- And 10 more exciting adventures!

## How to Run the Seed Script

### Option 1: Using npm script
```bash
cd backend
npm run seed
```

### Option 2: Using Prisma directly
```bash
cd backend
npx prisma db seed
```

### Option 3: Manual execution
```bash
cd backend
node prisma/seed.js
```

## Test Accounts Created

### Admin Account
- **Email**: admin@greenpathbookings.com
- **Password**: admin123
- **Role**: ADMIN

### Test User Accounts
- **Email**: john.doe@email.com
- **Password**: password123
- **Role**: USER

*Additional test users: jane.smith@email.com, mike.brown@email.com, emma.wilson@email.com (all with password: password123)*

## What Happens During Seeding

1. **Data Cleanup**: Removes all existing bookings, tours, and users
2. **User Creation**: Creates users with hashed passwords
3. **Tour Creation**: Adds 15 realistic eco-tours with proper dates and pricing
4. **Sample Bookings**: Creates bookings with various statuses (PENDING, CONFIRMED, COMPLETED, CANCELLED)

## Important Notes

- **Data Loss Warning**: The seed script clears ALL existing data before seeding
- **Tour Dates**: Tours are scheduled for realistic future dates (Oct 2025 - Feb 2026)
- **Pricing**: Tour prices range from $1,799 to $4,299, reflecting realistic eco-tour costs
- **Images**: Uses high-quality Unsplash images for tour displays

## Troubleshooting

If you encounter any issues:

1. Make sure you're in the backend directory
2. Ensure the database is properly configured (.env file)
3. Run `npx prisma generate` if you get Prisma client errors
4. Check that all dependencies are installed with `npm install`

## After Seeding

Once seeded, you can:
1. Login as admin to manage tours and bookings
2. Login as a test user to browse and book tours
3. Test the complete booking workflow
4. Verify admin booking confirmation features

The seed data provides a comprehensive testing environment for all features of the GreenPathBookings application.