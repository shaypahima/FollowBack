import { prisma } from "../src/db";

async function main() {
  // Create multiple users
  await prisma.profile.create({
    data: { username: "moshem", timestamp: 1237137, url: "http://foo.com" },
  });

  console.log("Seed data inserted!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
