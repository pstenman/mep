import { initTRPC } from "@trpc/server";
import type { Context } from "./context";
import { ZodError, z } from "zod";

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? z.treeifyError(error.cause) : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
