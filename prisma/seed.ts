import { PrismaClient, AdminRole, EventType, EventStatus, ActivityCategory } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Super Admin
  const adminPasswordHash = await argon2.hash('CocaCola2026!');
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@cocacola.test' },
    update: {},
    create: {
      email: 'admin@cocacola.test',
      fullName: 'Super Admin Coca-Cola',
      passwordHash: adminPasswordHash,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });
  console.log('✅ Admin user created/upserted:', admin.email);

  // 2. Products Catalog
  const productsData = [
    { sku: 'CC-ORIG-350', name: 'Coca-Cola Sabor Original 350ml', brandLine: 'Coca-Cola Original' },
    { sku: 'CC-ZERO-350', name: 'Coca-Cola Sin Azúcar 350ml', brandLine: 'Coca-Cola Sin Azúcar' },
    { sku: 'CC-ZERO-VAN-350', name: 'Coca-Cola Zero Vainilla 350ml', brandLine: 'Coca-Cola Creaciones' },
    { sku: 'SP-ORIG-350', name: 'Sprite Lima-Limón 350ml', brandLine: 'Sprite' },
    { sku: 'FA-NAR-350', name: 'Fanta Naranja 350ml', brandLine: 'Fanta' },
  ];

  const products = [];
  for (const prod of productsData) {
    const p = await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {},
      create: prod,
    });
    products.push(p);
  }
  console.log(`✅ Upserted ${products.length} catalog products`);

  // 3. Demo Event
  const pinHash = await argon2.hash('123456');
  const now = new Date();
  const startsAt = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
  const endsAt = new Date(now.getTime() + 10 * 60 * 60 * 1000); // in 10 hours

  const event = await prisma.event.upsert({
    where: { publicCode: 'LOLLA26' },
    update: {},
    create: {
      publicCode: 'LOLLA26',
      name: 'Coca-Cola Experience Lollapalooza 2026',
      type: EventType.FESTIVAL,
      status: EventStatus.ACTIVE,
      startsAt,
      endsAt,
      timezone: 'America/Santiago',
      location: 'Parque Bicentenario de Cerrillos',
      city: 'Santiago',
      capacity: 5000,
      attendanceGoal: 4000,
      overbookingFactor: 1.2,
      feedbackDelayMinutes: 30,
      feedbackWindowHours: 48,
      createdById: admin.id,
      activities: {
        create: [
          {
            name: 'Sampling Stage Principal',
            category: ActivityCategory.SAMPLING,
            maxClaimsPerUser: 2,
            products: {
              create: products.map((prod) => ({
                productId: prod.id,
              })),
            },
          },
          {
            name: 'Photo Booth Coca-Cola Zero',
            category: ActivityCategory.PHOTO_BOOTH,
            maxClaimsPerUser: 1,
          },
        ],
      },
      staffAccesses: {
        create: [
          {
            label: 'Acceso General / Puerta Norte',
            pinHash,
            canCheckIn: true,
            allowedActivityIds: [],
          },
        ],
      },
      couponCampaign: {
        create: {
          codePrefix: 'COCA2026',
          discountLabel: '30% dcto en tu próximo six-pack Coca-Cola Zero',
          minSentiment: 3,
          expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          maxCoupons: 1000,
        },
      },
    },
  });
  console.log('✅ Demo Event created/upserted:', event.publicCode);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error executing seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
