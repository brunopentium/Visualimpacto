CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`action` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`owner_id` text PRIMARY KEY NOT NULL,
	`weekly_contacts` integer DEFAULT 5 NOT NULL,
	`weekly_followups` integer DEFAULT 5 NOT NULL,
	`weekly_demos` integer DEFAULT 2 NOT NULL,
	`updated_at` text NOT NULL
);
