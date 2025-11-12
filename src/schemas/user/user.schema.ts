import z from "zod";
import { userSelectSchema } from "../../db/schema/index.js";
import { createPaginatedSchema } from "../../utils/schema.utils.js";

export const paginatedUserSchema = createPaginatedSchema(userSelectSchema);

export type PaginatedUser = z.infer<typeof paginatedUserSchema>;

z.globalRegistry.add(paginatedUserSchema, { id: "paginatedUser" });
