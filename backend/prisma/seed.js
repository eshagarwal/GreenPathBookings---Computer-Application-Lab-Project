import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Realistic tour data with environmental themes
const toursData = [
  {
    title: "Amazon Rainforest Conservation Experience",
    description: "Join our eco-conscious expedition deep into the Amazon rainforest. Work alongside local conservationists to protect endangered wildlife, learn about indigenous cultures, and participate in reforestation efforts. This immersive experience combines adventure with meaningful environmental action.",
    destination: "Amazon Basin, Brazil",
    price: 2899.99,
    duration: 10,
    maxCapacity: 12,
    startDate: new Date('2025-10-15'),
    endDate: new Date('2025-10-25'),
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",
    isActive: true
  },
  {
    title: "Costa Rica Wildlife Sanctuary Volunteer Tour",
    description: "Contribute to wildlife rehabilitation while exploring Costa Rica's incredible biodiversity. Help care for rescued sloths, monkeys, and tropical birds while learning about sustainable tourism practices. Includes guided nature walks and sustainable farming workshops.",
    destination: "Manuel Antonio, Costa Rica",
    price: 1799.99,
    duration: 7,
    maxCapacity: 15,
    startDate: new Date('2025-11-05'),
    endDate: new Date('2025-11-12'),
    imageUrl: "https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=800",
    isActive: true
  },
  {
    title: "Arctic Climate Research Expedition",
    description: "Experience the breathtaking Arctic landscape while contributing to vital climate research. Work with scientists studying ice formations, observe polar wildlife, and learn about the impact of climate change firsthand. Includes camping under the northern lights.",
    destination: "Svalbard, Norway",
    price: 4299.99,
    duration: 12,
    maxCapacity: 8,
    startDate: new Date('2025-12-01'),
    endDate: new Date('2025-12-13'),
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    isActive: true
  },
  {
    title: "Galápagos Marine Conservation Adventure",
    description: "Dive into marine conservation in the legendary Galápagos Islands. Participate in coral reef restoration, marine species monitoring, and sea turtle protection programs. Snorkel with sea lions, marine iguanas, and colorful tropical fish.",
    destination: "Galápagos Islands, Ecuador",
    price: 3599.99,
    duration: 9,
    maxCapacity: 10,
    startDate: new Date('2025-10-20'),
    endDate: new Date('2025-10-29'),
    imageUrl: "https://plus.unsplash.com/premium_photo-1669472887819-ce979268ae9b?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isActive: true
  },
  {
    title: "Himalayan Sustainable Trekking Experience",
    description: "Trek through stunning Himalayan landscapes while supporting local communities through sustainable tourism. Learn traditional mountain crafts, participate in organic farming, and contribute to clean energy projects in remote villages.",
    destination: "Annapurna Region, Nepal",
    price: 2199.99,
    duration: 14,
    maxCapacity: 16,
    startDate: new Date('2025-11-15'),
    endDate: new Date('2025-11-29'),
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    isActive: true
  },
  {
    title: "African Savanna Wildlife Protection Safari",
    description: "Join anti-poaching efforts and wildlife research in Kenya's premier conservancies. Track endangered species, work with local Maasai communities, and contribute to habitat preservation. Experience the Big Five while making a real conservation impact.",
    destination: "Maasai Mara, Kenya",
    price: 3299.99,
    duration: 11,
    maxCapacity: 14,
    startDate: new Date('2025-12-10'),
    endDate: new Date('2025-12-21'),
    imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800",
    isActive: true
  },
  {
    title: "Great Barrier Reef Restoration Project",
    description: "Contribute to the world's largest coral restoration project while exploring Australia's iconic Great Barrier Reef. Learn coral gardening techniques, monitor reef health, and work alongside marine biologists to combat coral bleaching.",
    destination: "Cairns, Australia",
    price: 2799.99,
    duration: 8,
    maxCapacity: 12,
    startDate: new Date('2025-11-01'),
    endDate: new Date('2025-11-09'),
    imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800",
    isActive: true
  },
  {
    title: "Madagascar Lemur Conservation Expedition",
    description: "Protect endangered lemur species in Madagascar's unique ecosystem. Participate in forest restoration, conduct wildlife surveys, and work with local communities on sustainable livelihood projects. Explore one of the world's most biodiverse hotspots.",
    destination: "Andasibe-Mantadia, Madagascar",
    price: 2599.99,
    duration: 10,
    maxCapacity: 10,
    startDate: new Date('2025-10-25'),
    endDate: new Date('2025-11-04'),
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    isActive: true
  },
  {
    title: "Borneo Orangutan Rehabilitation Adventure",
    description: "Help rehabilitate orphaned orangutans in Borneo's pristine rainforest. Assist with feeding programs, habitat enrichment, and forest replanting. Experience river safaris and discover the incredible biodiversity of one of the world's oldest rainforests.",
    destination: "Sabah, Malaysian Borneo",
    price: 2399.99,
    duration: 9,
    maxCapacity: 8,
    startDate: new Date('2025-12-05'),
    endDate: new Date('2025-12-14'),
    imageUrl: "https://images.unsplash.com/photo-1595575694455-b19549b73fcd?w=800",
    isActive: true
  },
  {
    title: "Patagonia Glacier Conservation Study",
    description: "Document glacial changes in the stunning Patagonian landscape while trekking through pristine wilderness. Assist researchers studying climate impact on glaciers, photograph wildlife, and experience the raw beauty of South America's southern frontier.",
    destination: "El Calafate, Argentina",
    price: 3199.99,
    duration: 12,
    maxCapacity: 12,
    startDate: new Date('2026-01-08'),
    endDate: new Date('2026-01-20'),
    imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800",
    isActive: true
  },
  {
    title: "Pacific Island Marine Protected Area Volunteer Program",
    description: "Support marine conservation efforts in pristine Pacific waters. Conduct underwater surveys, assist with sea turtle monitoring, and participate in coral planting initiatives. Experience traditional island culture and sustainable fishing practices.",
    destination: "Palau, Micronesia",
    price: 3899.99,
    duration: 11,
    maxCapacity: 6,
    startDate: new Date('2026-01-15'),
    endDate: new Date('2026-01-26'),
    imageUrl: "https://images.unsplash.com/photo-1571407971684-19b5d8d3c014?w=800",
    isActive: true
  },
  {
    title: "Chilean Desert Astronomy & Conservation Tour",
    description: "Combine stargazing in the world's driest desert with desert conservation work. Help protect unique desert ecosystems, study endemic species, and experience world-class astronomical observations in the Atacama Desert's crystal-clear skies.",
    destination: "Atacama Desert, Chile",
    price: 2299.99,
    duration: 8,
    maxCapacity: 14,
    startDate: new Date('2025-11-20'),
    endDate: new Date('2025-11-28'),
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    isActive: true
  },
  {
    title: "Canadian Wilderness Wolf Research Expedition",
    description: "Join wolf researchers in the Canadian wilderness to study pack behavior and contribute to conservation efforts. Track wildlife, analyze predator-prey relationships, and experience the untamed beauty of the boreal forest ecosystem.",
    destination: "Yukon Territory, Canada",
    price: 2899.99,
    duration: 10,
    maxCapacity: 8,
    startDate: new Date('2025-12-15'),
    endDate: new Date('2025-12-25'),
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    isActive: true
  },
  {
    title: "Scandinavian Sustainable Living Workshop Tour",
    description: "Learn sustainable living practices in the Nordic countries. Visit eco-villages, renewable energy facilities, and organic farms. Participate in traditional crafts, forest bathing, and discover how Scandinavian countries lead in environmental innovation.",
    destination: "Oslo & Stockholm, Norway & Sweden",
    price: 1899.99,
    duration: 7,
    maxCapacity: 18,
    startDate: new Date('2025-10-30'),
    endDate: new Date('2025-11-06'),
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    isActive: true
  },
  {
    title: "Indonesian Coral Triangle Conservation Dive",
    description: "Explore the world's most biodiverse marine region while contributing to coral conservation. Participate in reef monitoring, underwater cleanup efforts, and marine education programs. Dive among manta rays, sharks, and pristine coral gardens.",
    destination: "Raja Ampat, Indonesia",
    price: 3299.99,
    duration: 9,
    maxCapacity: 10,
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-02-10'),
    imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800",
    isActive: true
  }
];

// Sample users for testing
const usersData = [
  {
    email: "admin@greenpathbookings.com",
    password: "admin123",
    firstName: "Sarah",
    lastName: "Johnson",
    role: "ADMIN"
  },
  {
    email: "john.doe@email.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    role: "USER"
  },
  {
    email: "jane.smith@email.com",
    password: "password123",
    firstName: "Jane",
    lastName: "Smith",
    role: "USER"
  },
  {
    email: "mike.brown@email.com",
    password: "password123",
    firstName: "Mike",
    lastName: "Brown",
    role: "USER"
  },
  {
    email: "emma.wilson@email.com",
    password: "password123",
    firstName: "Emma",
    lastName: "Wilson",
    role: "USER"
  }
];

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.booking.deleteMany();
    await prisma.tour.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    console.log('👥 Creating users...');
    const hashedUsers = await Promise.all(
      usersData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );

    const createdUsers = await prisma.user.createMany({
      data: hashedUsers
    });
    console.log(`✅ Created ${createdUsers.count} users`);

    // Create tours
    console.log('🗺️  Creating tours...');
    const createdTours = await prisma.tour.createMany({
      data: toursData
    });
    console.log(`✅ Created ${createdTours.count} tours`);

    // Create some sample bookings
    console.log('📅 Creating sample bookings...');
    const tours = await prisma.tour.findMany();
    const users = await prisma.user.findMany({ where: { role: 'USER' } });

    const sampleBookings = [
      {
        userId: users[0].id,
        tourId: tours[0].id,
        numberOfPeople: 2,
        totalPrice: tours[0].price * 2,
        status: 'PENDING'
      },
      {
        userId: users[1].id,
        tourId: tours[1].id,
        numberOfPeople: 1,
        totalPrice: tours[1].price,
        status: 'CONFIRMED'
      },
      {
        userId: users[2].id,
        tourId: tours[2].id,
        numberOfPeople: 3,
        totalPrice: tours[2].price * 3,
        status: 'PENDING'
      },
      {
        userId: users[3].id,
        tourId: tours[3].id,
        numberOfPeople: 2,
        totalPrice: tours[3].price * 2,
        status: 'COMPLETED'
      },
      {
        userId: users[0].id,
        tourId: tours[4].id,
        numberOfPeople: 1,
        totalPrice: tours[4].price,
        status: 'CANCELLED'
      },
      {
        userId: users[1].id,
        tourId: tours[5].id,
        numberOfPeople: 4,
        totalPrice: tours[5].price * 4,
        status: 'CONFIRMED'
      }
    ];

    const createdBookings = await prisma.booking.createMany({
      data: sampleBookings
    });
    console.log(`✅ Created ${createdBookings.count} sample bookings`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${createdUsers.count} (including 1 admin)`);
    console.log(`   Tours: ${createdTours.count} eco-friendly adventures`);
    console.log(`   Bookings: ${createdBookings.count} sample bookings`);
    console.log('\n🔐 Admin Login:');
    console.log('   Email: admin@greenpathbookings.com');
    console.log('   Password: admin123');
    console.log('\n👤 Test User Login:');
    console.log('   Email: john.doe@email.com');
    console.log('   Password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });