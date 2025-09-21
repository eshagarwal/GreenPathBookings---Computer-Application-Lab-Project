import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Simple analytics verification script
 * Shows a summary of the booking data for analytics purposes
 */

async function showAnalyticsSummary() {
  console.log('📊 GreenPathBookings Analytics Summary');
  console.log('=====================================\n');

  try {
    // Basic counts
    const totalUsers = await prisma.user.count();
    const totalTours = await prisma.tour.count();
    const totalBookings = await prisma.booking.count();
    const originalBookings = await prisma.booking.count({
      where: { createdAt: { gte: new Date('2025-09-21') } }
    });

    console.log('📈 Overview:');
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Total Tours: ${totalTours}`);
    console.log(`   Total Bookings: ${totalBookings}`);
    console.log(`   Original Bookings (today): ${originalBookings}`);
    console.log(`   Historic Bookings: ${totalBookings - originalBookings}\n`);

    // Status distribution
    const statusCounts = await prisma.booking.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    console.log('📊 Booking Status Distribution:');
    statusCounts.forEach(item => {
      const percentage = ((item._count.status / totalBookings) * 100).toFixed(1);
      console.log(`   ${item.status}: ${item._count.status} (${percentage}%)`);
    });
    console.log();

    // Monthly revenue (confirmed + completed only)
    const monthlyRevenue = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'COMPLETED'] }
      },
      select: {
        totalPrice: true,
        createdAt: true
      }
    });

    const revenueByMonth = {};
    let totalRevenue = 0;

    monthlyRevenue.forEach(booking => {
      const date = new Date(booking.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + booking.totalPrice;
      totalRevenue += booking.totalPrice;
    });

    console.log('💰 Revenue Summary:');
    console.log(`   Total Revenue: $${totalRevenue.toLocaleString()}`);
    console.log(`   Average per Booking: $${(totalRevenue / monthlyRevenue.length).toLocaleString()}\n`);

    console.log('📅 Monthly Revenue Distribution:');
    Object.entries(revenueByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([month, revenue]) => {
        const [year, monthNum] = month.split('-');
        const monthName = new Date(year, monthNum - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        console.log(`   ${monthName}: $${revenue.toLocaleString()}`);
      });
    console.log();

    // Popular tours
    const popularTours = await prisma.booking.groupBy({
      by: ['tourId'],
      _count: { tourId: true },
      orderBy: { _count: { tourId: 'desc' } },
      take: 5
    });

    console.log('🏆 Top 5 Most Popular Tours:');
    for (const tourBooking of popularTours) {
      const tour = await prisma.tour.findUnique({
        where: { id: tourBooking.tourId }
      });
      console.log(`   ${tour.title}: ${tourBooking._count.tourId} bookings`);
    }
    console.log();

    // Date range
    const firstBooking = await prisma.booking.findFirst({
      orderBy: { createdAt: 'asc' }
    });
    const lastBooking = await prisma.booking.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    console.log('📅 Data Range:');
    console.log(`   Earliest Booking: ${firstBooking.createdAt.toISOString().split('T')[0]}`);
    console.log(`   Latest Booking: ${lastBooking.createdAt.toISOString().split('T')[0]}`);
    console.log(`   Data Span: ${Math.ceil((lastBooking.createdAt - firstBooking.createdAt) / (1000 * 60 * 60 * 24))} days\n`);

    console.log('✨ Your admin panel should now show rich analytics with this data!');
    console.log('🔗 Access the admin panel to see charts and visualizations.');

  } catch (error) {
    console.error('❌ Error generating analytics summary:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the summary
showAnalyticsSummary();