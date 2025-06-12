import { initTRPC } from "@trpc/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const createContext = () => {
  return {
    prisma: client,
  };
};
const trpc = initTRPC.context<typeof createContext>().create();
const procedure = trpc.procedure;
const router = trpc.router;

export { trpc, procedure, router, createContext };
