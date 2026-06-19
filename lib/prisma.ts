import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Create a global storage space for the client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Set up the PostgreSQL driver adapter connection pool
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Reuse the existing connection or create a new one if it does not exist
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// Store the connection globally only during local development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
