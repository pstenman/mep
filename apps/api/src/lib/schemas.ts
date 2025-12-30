import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20),
});

export const sortingSchema = z.array(
  z.object({
    id: z.string(),
    desc: z.boolean(),
  }),
);
