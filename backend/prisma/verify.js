import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyData() {
  console.log('🔍 Verifying seeded data...\n');

  try {
    // Count records
    const userCount = await prisma.user.count();
    const tourCount = await prisma.tour.count();
    const bookingCount = await prisma.booking.count();

    console.log('📊 Database Summary:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Tours: ${tourCount}`);
    console.log(`   Bookings: ${bookingCount}\n`);

    // Show sample tours
    console.log('🗺️  Sample Tours:');
    const sampleTours = await prisma.tour.findMany({
      take: 5,
      select: {
        title: true,
        destination: true,
        price: true,
        duration: true,
        startDate: true
      }
    });

    sampleTours.forEach((tour, index) => {
      console.log(`   ${index + 1}. ${tour.title}`);
      console.log(`      📍 ${tour.destination}`);
      console.log(`      💰 $${tour.price} • ⏱️  ${tour.duration} days`);
      console.log(`      📅 Starts: ${tour.startDate.toDateString()}\n`);
    });

    // Show booking statuses
    console.log('📋 Booking Status Distribution:');
    const bookingStats = await prisma.booking.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    bookingStats.forEach(stat => {
      console.log(`   ${stat.status}: ${stat._count.status} bookings`);
    });

    console.log('\n✅ Data verification complete!');

  } catch (error) {
    console.error('❌ Error verifying data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyData();