import { z } from "zod";

export const PaginationNamedDto = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    }),
  ),
});
export type PaginationNamedDto = z.infer<typeof PaginationNamedDto>;

export const PaginationUnnamedDto = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(
    z.object({
      name: z.string(),
    }),
  ),
});
export type PaginationUnnamedDto = z.infer<typeof PaginationUnnamedDto>;
