import { eq } from "drizzle-orm";
import db from "../config/db.js";
import { users } from "./schema/index.js";
import bcrypt from "bcrypt";

export async function seed() {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, "admin@admin.com"));
  if (existing.length > 0) {
    console.log("✅ Seed skipped (already seeded)");
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await db.insert(users).values({
    fullName: "Admin",
    email: "admin@admin.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("🌱 Database seeded!");
}

await seed();
