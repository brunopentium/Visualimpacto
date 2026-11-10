import { sqliteTable,text,integer } from 'drizzle-orm/sqlite-core';
export const settings=sqliteTable('settings',{ownerId:text('owner_id').primaryKey(),weeklyContacts:integer('weekly_contacts').notNull().default(5),weeklyFollowups:integer('weekly_followups').notNull().default(5),weeklyDemos:integer('weekly_demos').notNull().default(2),updatedAt:text('updated_at').notNull()});
export const audit=sqliteTable('audit',{id:text('id').primaryKey(),ownerId:text('owner_id').notNull(),action:text('action').notNull(),createdAt:text('created_at').notNull()});
export const sessions=sqliteTable('sessions',{tokenHash:text('token_hash').primaryKey(),expiresAt:integer('expires_at').notNull()});
export const loginLimits=sqliteTable('login_limits',{key:text('key').primaryKey(),window:integer('window').notNull(),attempts:integer('attempts').notNull()});
