import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sport4everyone.com' },
    update: {},
    create: {
      email: 'admin@sport4everyone.com',
      password: adminPassword,
      name: 'Administrator',
      administrator: true,
    },
  })
  console.log('✓ Created admin user:', admin.email)

  // Create sports
  const football = await prisma.sport.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Football',
    },
  })

  const basketball = await prisma.sport.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Basketball',
    },
  })

  const tennis = await prisma.sport.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Tennis',
    },
  })
  console.log('✓ Created sports: Football, Basketball, Tennis')

  // Create sports center
  const sportsCenter = await prisma.sportsCenter.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Central Sports Complex',
      location: '123 Main Street, City Center',
      attendance: 0,
      openingTime: '08:00-22:00',
      ownerId: admin.id,
    },
  })
  console.log('✓ Created sports center:', sportsCenter.name)

  // Create sports fields
  const footballField = await prisma.sportsField.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Football Field A',
      price: 50.0,
      sportsCenterId: sportsCenter.id,
      sports: {
        connect: [{ id: football.id }],
      },
    },
  })

  const basketballCourt = await prisma.sportsField.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Basketball Court 1',
      price: 30.0,
      sportsCenterId: sportsCenter.id,
      sports: {
        connect: [{ id: basketball.id }],
      },
    },
  })

  const tennisCourt = await prisma.sportsField.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Tennis Court 1',
      price: 25.0,
      sportsCenterId: sportsCenter.id,
      sports: {
        connect: [{ id: tennis.id }],
      },
    },
  })

  console.log('✓ Created sports fields:', footballField.name, basketballCourt.name, tennisCourt.name)

  console.log('\n✅ Database seeded successfully!')
  console.log('\nAdmin credentials:')
  // console.log('  Email: admin@sport4everyone.com')
  // console.log('  Password: admin123')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
