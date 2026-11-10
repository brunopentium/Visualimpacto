CREATE TABLE `activities` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`lead_id` text,
	`type` text NOT NULL,
	`date` text NOT NULL,
	`channel` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`authorized` integer DEFAULT 0 NOT NULL,
	`cancelled` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`segment` text NOT NULL,
	`contact_name` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`instagram` text DEFAULT '' NOT NULL,
	`website` text DEFAULT '' NOT NULL,
	`city` text DEFAULT '' NOT NULL,
	`source` text DEFAULT '' NOT NULL,
	`stage` text DEFAULT 'A pesquisar' NOT NULL,
	`next_action` text DEFAULT '' NOT NULL,
	`next_date` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`loss_reason` text DEFAULT '' NOT NULL,
	`archived` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
