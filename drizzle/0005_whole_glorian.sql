CREATE TABLE `lead_research` (
	`lead_id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`import_key` text NOT NULL,
	`score` integer NOT NULL,
	`batch` text NOT NULL,
	`data` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `research_owner_identity` ON `lead_research` (`owner_id`,`import_key`);