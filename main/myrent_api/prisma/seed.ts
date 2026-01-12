// prisma/seed.ts
import "dotenv/config";
import { PrismaClient, booking_status, user_role, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL missing in .env");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helpers
function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function ensureEndAfterStart(start: Date, minDays = 1, maxDays = 10) {
  const daysToAdd = faker.number.int({ min: minDays, max: maxDays });
  return addDays(start, daysToAdd);
}

async function main() {
  console.log("Seeding database...");


  await prisma.bookings.deleteMany();
  await prisma.property_availability.deleteMany();
  await prisma.properties.deleteMany();
  await prisma.users.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // ===== USERS =====
  const users: Array<{ id: string; role: user_role }> = [];

  for (let i = 0; i < 10; i++) {
    const role: user_role = i === 0 ? "ADMIN" : i < 4 ? "OWNER" : "TENANT";

    const user = await prisma.users.create({
      data: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        password_hash: passwordHash,
        role,
      },
      select: { id: true, role: true },
    });

    users.push(user);
  }

  const owners = users.filter((u) => u.role === "OWNER");
  const tenants = users.filter((u) => u.role === "TENANT");

  // ===== PROPERTIES + AVAILABILITY =====
  const properties: Array<{ id: string; price_per_night: Prisma.Decimal }> = [];

  for (let i = 0; i < 8; i++) {
    const owner = faker.helpers.arrayElement(owners);
    const pricePerNightInt = faker.number.int({ min: 40, max: 250 });

    const property = await prisma.properties.create({
      data: {
        owner_id: owner.id,
        title: faker.lorem.words(4).slice(0, 150),
        description: faker.lorem.paragraph(),
        city: faker.location.city().slice(0, 120),
        address: faker.location.streetAddress().slice(0, 255),
        max_guests: faker.number.int({ min: 1, max: 8 }),
        price_per_night: new Prisma.Decimal(pricePerNightInt),
      },
      select: { id: true, price_per_night: true },
    });

    properties.push(property);

    // dispo future (end > start garanti)
    const start = faker.date.soon({ days: 15 });
    const end = ensureEndAfterStart(start, 1, 30);

    await prisma.property_availability.create({
      data: {
        property_id: property.id,
        start_date: start,
        end_date: end,
        is_available: true,
      },
    });
  }

  // ===== BOOKINGS =====
  for (let i = 0; i < 12; i++) {
    const tenant = faker.helpers.arrayElement(tenants);
    const property = faker.helpers.arrayElement(properties);

    const startDate = faker.date.soon({ days: 30 });
    const endDate = ensureEndAfterStart(startDate, 1, 14); // end > start garanti

    // nuits (>= 1)
    const msPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.max(
      1,
      Math.round((endDate.getTime() - startDate.getTime()) / msPerDay)
    );

    const pricePerNight = Number(property.price_per_night);
    const totalPrice = new Prisma.Decimal((pricePerNight * nights).toFixed(2));

    const status: booking_status = faker.helpers.arrayElement([
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
    ]);

    await prisma.bookings.create({
      data: {
        tenant_id: tenant.id,
        property_id: property.id,
        start_date: startDate,
        end_date: endDate,
        total_price: totalPrice,
        status,
      },
    });
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
