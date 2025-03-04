import { pgTable, text, serial, integer, boolean, timestamp, real, date, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: date("date").notNull(),
  category: text("category").notNull(), // sleep, activity, cardiovascular, stress, etc.
  name: text("name").notNull(), // deep_sleep, hrv, steps, etc.
  value: real("value").notNull(),
  unit: text("unit").notNull(),
  comparisonValue: real("comparison_value"),
  percentChange: real("percent_change"),
  status: text("status"), // success, warning, danger
  minValue: real("min_value"),
  maxValue: real("max_value"),
  historicalData: json("historical_data").$type<number[]>(),
});

export const studyInfo = pgTable("study_info", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  currentDay: integer("current_day").notNull(),
  totalDays: integer("total_days").notNull(),
  daysRemaining: integer("days_remaining").notNull(),
  studyName: text("study_name").notNull(),
});

export const correlationFactors = pgTable("correlation_factors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  factorName: text("factor_name").notNull(),
  lastTracked: date("last_tracked"),
  status: boolean("status").notNull(),
  metrics: json("metrics").$type<Array<{
    name: string;
    percentChange: number;
    status: string;
    value: number;
  }>>(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertHealthMetricSchema = createInsertSchema(healthMetrics).omit({
  id: true,
});

export const insertStudyInfoSchema = createInsertSchema(studyInfo).omit({
  id: true,
});

export const insertCorrelationFactorSchema = createInsertSchema(correlationFactors).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertHealthMetric = z.infer<typeof insertHealthMetricSchema>;
export type HealthMetric = typeof healthMetrics.$inferSelect;

export type InsertStudyInfo = z.infer<typeof insertStudyInfoSchema>;
export type StudyInfo = typeof studyInfo.$inferSelect;

export type InsertCorrelationFactor = z.infer<typeof insertCorrelationFactorSchema>;
export type CorrelationFactor = typeof correlationFactors.$inferSelect;
