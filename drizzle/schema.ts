import {
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** Curated demo roles are loaded once when the database is available, with an in-memory fallback for local resilience. */
export const jobs = mysqlTable("jobs", {
  id: varchar("id", { length: 96 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  companyLogo: text("companyLogo"),
  location: varchar("location", { length: 255 }).notNull(),
  remote: int("remote").notNull().default(0),
  workMode: varchar("workMode", { length: 20 }).notNull(),
  jobType: varchar("jobType", { length: 20 }).notNull(),
  experienceLevel: varchar("experienceLevel", { length: 20 }).notNull(),
  salaryMin: int("salaryMin"),
  salaryMax: int("salaryMax"),
  currency: varchar("currency", { length: 8 }).notNull().default("INR"),
  description: text("description").notNull(),
  skills: json("skills").$type<string[]>().notNull(),
  postedAt: timestamp("postedAt").notNull(),
  source: varchar("source", { length: 128 }).notNull(),
  applyUrl: text("applyUrl").notNull(),
  featured: int("featured").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
