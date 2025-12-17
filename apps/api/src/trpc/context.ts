import { db } from "@mep/db";

export const createTRPCContext = async (opts: {
  req: Request;
  resheader: Headers;
}) => {
  return {
    db,
    headers: opts.req.headers,
  };
};

type BaseContext = Awaited<ReturnType<typeof createTRPCContext>>;

export type Context = BaseContext;
