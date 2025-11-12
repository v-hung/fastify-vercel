import { z } from "zod";
import { SomeType } from "zod/v4/core";

export function createPaginatedSchema<T extends SomeType>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    meta: z.object({
      page: z.number(),
      pageSize: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  });
}
