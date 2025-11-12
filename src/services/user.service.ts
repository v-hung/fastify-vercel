import db from "../config/db.js";
import { users } from "../db/schema/users.js";
import { eq, like } from "drizzle-orm";
import { PaginationInput } from "../schemas/auth/pagination.schema.js";
import { PaginatedUser } from "../schemas/user/user.schema.js";

export const getAll = async () => {
  return await db.select().from(users);
};

export const search = async (
  input: PaginationInput
): Promise<PaginatedUser> => {
  const limit = input.pageSize;
  const offset = (input.page - 1) * input.pageSize;

  const data = await db
    .select()
    .from(users)
    .offset(offset)
    .limit(limit)
    .where(like(users.email, `%${input.p}%`));

  const total = await db.$count(users);

  return {
    data,
    meta: {
      page: input.page,
      pageSize: input.pageSize,
      total,
      totalPages: Math.ceil(total / input.pageSize),
    },
  };
};

export const getById = async (id: number) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      locker: true,
    },
  });

  return user;
};

export const create = async (data: typeof users.$inferInsert) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

export const update = async (
  id: number,
  data: Partial<typeof users.$inferInsert>
) => {
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return user;
};

export const remove = async (id: number) => {
  const result = await db.delete(users).where(eq(users.id, id));
};
