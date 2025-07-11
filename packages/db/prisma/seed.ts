import { PrismaClient } from "../generated/prisma/index.js"
import bcrypt from "bcrypt";
const prisma = new PrismaClient()

async function main() {
  
  const alice = await prisma.user.upsert({
    where: { number: '9999999999' },
    update: {},
    create: {
      number: '9999999999',
      password: await bcrypt.hash('alice',10),
      name: 'alice',
      onRampTransition: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "122",
          provider: "HDFC Bank",
        },
      },
      balance:{
        create:{
          amount:20000,
          locked:0
        }
      }
    },
  })
  const bob = await prisma.user.upsert({
    where: { number: '9999999998' },
    update: {},
    create: {
      number: '9999999998',
      password: await bcrypt.hash('bob',10),
      name: 'bob',
      onRampTransition: {
        create: {
          startTime: new Date(),
          status: "Failure",
          amount: 2000,
          token: "123",
          provider: "HDFC Bank",
        },
      },
      balance:{
        create:{
          amount: 0,
          locked: 0,
        }
      }
    },
  })
  console.log({ alice, bob })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })