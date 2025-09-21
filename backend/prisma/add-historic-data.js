import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script to add historic data for analytics purposes
 * This script DOES NOT delete existing data - it only adds new historic records
 */

// Helper function to generate random date within a range
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to get a random element from array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to generate weighted random status (more realistic distribution)
function getRandomBookingStatus() {
  const statuses = [
    { status: 'COMPLETED', weight: 40 },
    { status: 'CONFIRMED', weight: 30 },
    { status: 'PENDING', weight: 15 },
    { status: 'CANCELLED', weight: 15 }
  ];
  
  const totalWeight = statuses.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of statuses) {
    if (random < item.weight) {
      return item.status;
    }
    random -= item.weight;
  }
  
  return 'PENDING';
}

// Helper function to generate realistic number of people (1-6, weighted towards smaller groups)
function getRandomNumberOfPeople() {
  const weights = [35, 25, 20, 10, 7, 3]; // 1 person: 35%, 2 people: 25%, etc.
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) {
      return i + 1;
    }
  }
  
  return 1;
}

// Generate seasonal booking patterns (more bookings in certain months)
function getSeasonalMultiplier(month) {
  // Month is 0-indexed (0 = January, 11 = December)
  const seasonalFactors = {
    0: 0.6,  // January - lower
    1: 0.7,  // February - lower
    2: 0.8,  // March - growing
    3: 1.2,  // April - spring season
    4: 1.4,  // May - peak spring
    5: 1.6,  // June - summer peak
    6: 1.8,  // July - highest
    7: 1.7,  // August - high
    8: 1.3,  // September - good
    9: 1.1,  // October - moderate
    10: 0.8, // November - lower
    11: 0.9  // December - holiday season
  };
  
  return seasonalFactors[month] || 1.0;
}

async function addHistoricData() {
  console.log('🔍 Starting historic data generation...');
  console.log('⚠️  This script will NOT delete any existing data');

  try {
    // Get existing users and tours
    const users = await prisma.user.findMany({ where: { role: 'USER' } });
    const tours = await prisma.tour.findMany();
    
    if (users.length === 0 || tours.length === 0) {
      throw new Error('No users or tours found. Please run the seed script first.');
    }

    console.log(`👥 Found ${users.length} users and 🗺️  ${tours.length} tours`);
    
    // Check existing bookings count
    const existingBookingsCount = await prisma.booking.count();
    console.log(`📊 Current bookings in database: ${existingBookingsCount}`);

    // Generate historic data for the past 12 months
    const endDate = new Date(); // Today
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1); // 12 months ago

    console.log(`📅 Generating data from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);

    const historicBookings = [];
    let totalHistoricBookings = 0;

    // Generate bookings month by month for realistic patterns
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(startDate);
      monthDate.setMonth(startDate.getMonth() + month);
      
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      
      // Base number of bookings per month (15-25), adjusted by seasonal factors
      const baseBookingsPerMonth = 15 + Math.floor(Math.random() * 11);
      const seasonalMultiplier = getSeasonalMultiplier(monthDate.getMonth());
      const bookingsThisMonth = Math.floor(baseBookingsPerMonth * seasonalMultiplier);
      
      console.log(`📅 Generating ${bookingsThisMonth} bookings for ${monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`);

      for (let i = 0; i < bookingsThisMonth; i++) {
        const user = getRandomElement(users);
        const tour = getRandomElement(tours);
        const numberOfPeople = getRandomNumberOfPeople();
        const status = getRandomBookingStatus();
        const bookingDate = getRandomDate(monthStart, monthEnd);
        
        // Calculate total price
        const totalPrice = tour.price * numberOfPeople;
        
        // Add some randomness to payment fields for completed/confirmed bookings
        let paymentId = null;
        let paymentStatus = null;
        let paymentMethod = null;
        
        if (status === 'COMPLETED' || status === 'CONFIRMED') {
          // 80% chance of having payment details for confirmed/completed bookings
          if (Math.random() < 0.8) {
            paymentId = `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            paymentStatus = 'COMPLETED';
            paymentMethod = Math.random() < 0.9 ? 'paypal' : 'stripe';
          }
        }

        const booking = {
          userId: user.id,
          tourId: tour.id,
          numberOfPeople,
          totalPrice,
          status,
          paymentId,
          paymentStatus,
          paymentMethod,
          createdAt: bookingDate,
          updatedAt: bookingDate
        };

        historicBookings.push(booking);
        totalHistoricBookings++;
      }
    }

    // Insert historic bookings in batches to avoid memory issues
    const batchSize = 50;
    let insertedCount = 0;

    console.log(`💾 Inserting ${totalHistoricBookings} historic bookings in batches of ${batchSize}...`);

    for (let i = 0; i < historicBookings.length; i += batchSize) {
      const batch = historicBookings.slice(i, i + batchSize);
      await prisma.booking.createMany({
        data: batch
      });
      insertedCount += batch.length;
      console.log(`✅ Inserted batch ${Math.ceil((i + 1) / batchSize)}/${Math.ceil(historicBookings.length / batchSize)} (${insertedCount}/${totalHistoricBookings} bookings)`);
    }

    // Verify the results
    const finalBookingsCount = await prisma.booking.count();
    const addedBookings = finalBookingsCount - existingBookingsCount;

    console.log('\n🎉 Historic data generation completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   📈 Bookings before: ${existingBookingsCount}`);
    console.log(`   📈 Bookings after: ${finalBookingsCount}`);
    console.log(`   ➕ Added: ${addedBookings} historic bookings`);
    console.log(`   🗓️  Date range: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);

    // Show some analytics preview
    const statusCounts = await prisma.booking.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    console.log('\n📊 Booking Status Distribution:');
    statusCounts.forEach(item => {
      console.log(`   ${item.status}: ${item._count.status} bookings`);
    });

    // Show monthly distribution
    const monthlyBookings = await prisma.$queryRaw`
      SELECT 
        strftime('%Y-%m', createdAt) as month,
        COUNT(*) as count
      FROM Booking 
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY month
    `;

    console.log('\n📅 Monthly Booking Distribution:');
    monthlyBookings.forEach(item => {
      console.log(`   ${item.month}: ${item.count} bookings`);
    });

    console.log('\n✨ Your analytics dashboard should now show rich historic data!');
    console.log('🔗 You can view the data in Prisma Studio or refresh your admin panel');

  } catch (error) {
    console.error('❌ Error generating historic data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Add some additional users for more realistic data (optional)
async function addAdditionalUsers() {
  console.log('👥 Adding some additional users for more realistic analytics...');
  
  const additionalUsers = [
    {
      email: "alex.johnson@email.com",
      password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdj6SB.xW1uyu", // hashed "password123"
      firstName: "Alex",
      lastName: "Johnson",
      role: "USER"
    },
    {
      email: "maria.garcia@email.com",
      password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdj6SB.xW1uyu",
      firstName: "Maria",
      lastName: "Garcia",
      role: "USER"
    },
    {
      email: "david.lee@email.com",
      password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdj6SB.xW1uyu",
      firstName: "David",
      lastName: "Lee",
      role: "USER"
    },
    {
      email: "sophia.miller@email.com",
      password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdj6SB.xW1uyu",
      firstName: "Sophia",
      lastName: "Miller",
      role: "USER"
    },
    {
      email: "ryan.wilson@email.com",
      password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdj6SB.xW1uyu",
      firstName: "Ryan",
      lastName: "Wilson",
      role: "USER"
    }
  ];

  // Only add users that don't already exist
  for (const userData of additionalUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });
    
    if (!existingUser) {
      await prisma.user.create({ data: userData });
      console.log(`✅ Added user: ${userData.firstName} ${userData.lastName}`);
    } else {
      console.log(`⏭️  User ${userData.email} already exists, skipping`);
    }
  }
}

async function main() {
  console.log('🌱 GreenPathBookings Historic Data Generator');
  console.log('============================================');
  
  try {
    // Optionally add more users first
    await addAdditionalUsers();
    
    // Generate historic bookings
    await addHistoricData();
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run the script
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

export { addHistoricData, addAdditionalUsers };