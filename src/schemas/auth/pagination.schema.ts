import { z } from "zod";

export const paginationQuerySchema = z.object({
  p: z.coerce.string().default(""),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationQuerySchema>;

z.globalRegistry.add(paginationQuerySchema, { id: "PaginationQuery" });
