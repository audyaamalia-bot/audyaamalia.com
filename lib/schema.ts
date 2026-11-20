import { pgTable, serial, text, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

export const works = pgTable("works", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  year: text("year").notNull().default(""),
  cover: text("cover").notNull().default(""),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  body: text("body").notNull().default(""),
  sort: integer("sort").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const texts = pgTable("texts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  date: text("date").notNull().default(""),
  body: text("body").notNull().default(""),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const press = pgTable("press", {
  id: serial("id").primaryKey(),
  year: text("year").notNull(),
  label: text("label").notNull(),
  url: text("url").notNull().default(""),
  sort: integer("sort").notNull().default(0),
});

export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull().default(""),
  sort: integer("sort").notNull().default(0),
});

export const slides = pgTable("slides", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  sort: integer("sort").notNull().default(0),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
});

export type Work = typeof works.$inferSelect;
export type TextPost = typeof texts.$inferSelect;
export type PressItem = typeof press.$inferSelect;
export type Publication = typeof publications.$inferSelect;
export type Slide = typeof slides.$inferSelect;

export const DDL = [
  `CREATE TABLE IF NOT EXISTS works (id serial PRIMARY KEY, slug text NOT NULL UNIQUE, title text NOT NULL, year text NOT NULL DEFAULT '', cover text NOT NULL DEFAULT '', images jsonb NOT NULL DEFAULT '[]', body text NOT NULL DEFAULT '', sort integer NOT NULL DEFAULT 0, published boolean NOT NULL DEFAULT true, created_at timestamp NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS texts (id serial PRIMARY KEY, slug text NOT NULL UNIQUE, title text NOT NULL, date text NOT NULL DEFAULT '', body text NOT NULL DEFAULT '', published boolean NOT NULL DEFAULT true, created_at timestamp NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS press (id serial PRIMARY KEY, year text NOT NULL, label text NOT NULL, url text NOT NULL DEFAULT '', sort integer NOT NULL DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS publications (id serial PRIMARY KEY, title text NOT NULL, url text NOT NULL DEFAULT '', sort integer NOT NULL DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS slides (id serial PRIMARY KEY, image text NOT NULL, sort integer NOT NULL DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS settings (key text PRIMARY KEY, value text NOT NULL DEFAULT '')`,
  `CREATE TABLE IF NOT EXISTS login_attempts (id serial PRIMARY KEY, ip text NOT NULL, at timestamp NOT NULL DEFAULT now())`,
  `CREATE INDEX IF NOT EXISTS login_attempts_ip_at ON login_attempts (ip, at)`,
];
