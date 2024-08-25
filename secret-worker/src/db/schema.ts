import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const secrets = sqliteTable('secrets', {
    id: text('id').primaryKey(),
    data: text('data').notNull(),
    timestamp: integer('timestamp').notNull()
});

export const insertSecretSchema = createInsertSchema(secrets, {
    id: (schema) => schema.id.uuid(),
    data: (schema) => schema.data.max(4096),
    timestamp: (schema) => schema.timestamp.min(0)
});

export const requestSecretSchema = insertSecretSchema.pick({
    data: true
})

export type InsertSecretSchema = z.infer<typeof insertSecretSchema>;
export type RequestSecretSchema = z.infer<typeof requestSecretSchema>;
