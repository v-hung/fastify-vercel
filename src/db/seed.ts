import { eq } from "drizzle-orm";
import db from "../config/db.js";
import { users } from "./schema/index.js";
import bcrypt from "bcrypt";

const USERS: (typeof users.$inferInsert)[] = [
  {
    fullName: "Admin",
    email: "admin@admin.com",
    password: "Admin@123",
    role: "admin",
  },
  {
    fullName: "Test",
    email: "test@gmail.com",
    password: "12345678",
    role: "user",
  },
];

export async function seed() {
  console.log("Database seeding ...");
  for (let user of USERS) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email));
    if (existing.length > 0) {
      console.log(`- Seed skipped (${user.email} already seeded)`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await db.insert(users).values({
      ...user,
      password: hashedPassword,
    });

    console.log(`- created ${user.email}`);
  }

  console.log("Database seeded!");
}

await seed();
