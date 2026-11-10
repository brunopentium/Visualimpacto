CREATE TABLE `jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`contract_id` text,
	`title` text NOT NULL,
	`briefing` text DEFAULT '' NOT NULL,
	`due_date` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'Briefing' NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`operation_id` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `production_events` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`job_id` text,
	`action` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `versions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`job_id` text,
	`asset_id` text,
	`sequence` integer NOT NULL,
	`source_ids` text NOT NULL,
	`checks` text NOT NULL,
	`minutes` integer DEFAULT 0 NOT NULL,
	`ai_cost_cents` integer DEFAULT 0 NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`approved_by` text DEFAULT '' NOT NULL,
	`approval_date` text DEFAULT '' NOT NULL,
	`approval_notes` text DEFAULT '' NOT NULL,
	`delivery_date` text DEFAULT '' NOT NULL,
	`delivery_notes` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `version_job_sequence` ON `versions` (`job_id`,`sequence`);
--> statement-breakpoint
CREATE TRIGGER jobs_capacity_insert BEFORE INSERT ON jobs
WHEN NEW.status <> 'Cancelado' AND (SELECT COUNT(*) FROM jobs WHERE contract_id=NEW.contract_id AND status <> 'Cancelado') >= COALESCE((SELECT quantity FROM contracts WHERE id=NEW.contract_id),0)
BEGIN SELECT RAISE(ABORT, 'CAPACITY'); END;
--> statement-breakpoint
CREATE TRIGGER jobs_capacity_update BEFORE UPDATE OF status,contract_id ON jobs
WHEN NEW.status <> 'Cancelado' AND (SELECT COUNT(*) FROM jobs WHERE contract_id=NEW.contract_id AND status <> 'Cancelado' AND id <> NEW.id) >= COALESCE((SELECT quantity FROM contracts WHERE id=NEW.contract_id),0)
BEGIN SELECT RAISE(ABORT, 'CAPACITY'); END;
--> statement-breakpoint
CREATE TRIGGER contracts_quantity_guard BEFORE UPDATE OF quantity ON contracts
WHEN NEW.quantity < (SELECT COUNT(*) FROM jobs WHERE contract_id=NEW.id AND status <> 'Cancelado')
BEGIN SELECT RAISE(ABORT, 'CONTRACT_QUANTITY'); END;
