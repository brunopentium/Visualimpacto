CREATE TABLE `cash_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`receivable_id` text,
	`expense_id` text,
	`parent_id` text,
	`kind` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`fee_cents` integer DEFAULT 0 NOT NULL,
	`direction` integer NOT NULL,
	`date` text NOT NULL,
	`method` text NOT NULL,
	`reference` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`cancelled` integer DEFAULT 0 NOT NULL,
	`cancel_reason` text DEFAULT '' NOT NULL,
	`request_key` text NOT NULL,
	`operation_id` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`receivable_id`) REFERENCES `receivables`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cash_request` ON `cash_entries` (`owner_id`,`request_key`);--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`contract_id` text,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`due_date` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`cancelled` integer DEFAULT 0 NOT NULL,
	`cancel_reason` text DEFAULT '' NOT NULL,
	`request_key` text NOT NULL,
	`operation_id` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `expense_request` ON `expenses` (`owner_id`,`request_key`);--> statement-breakpoint
CREATE TABLE `receivables` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`contract_id` text,
	`client_id` text,
	`title` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`due_date` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`cancelled` integer DEFAULT 0 NOT NULL,
	`cancel_reason` text DEFAULT '' NOT NULL,
	`request_key` text NOT NULL,
	`operation_id` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `receivable_owner_contract` ON `receivables` (`owner_id`,`contract_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `receivable_request` ON `receivables` (`owner_id`,`request_key`);
--> statement-breakpoint
CREATE TRIGGER cash_links_guard BEFORE INSERT ON cash_entries
WHEN NOT EXISTS (SELECT 1 FROM cash_entries WHERE owner_id=NEW.owner_id AND request_key=NEW.request_key) AND (
 (NEW.kind='Recebimento' AND NOT EXISTS (SELECT 1 FROM receivables WHERE id=NEW.receivable_id AND owner_id=NEW.owner_id AND cancelled=0)) OR
 (NEW.kind='Pagamento' AND NOT EXISTS (SELECT 1 FROM expenses WHERE id=NEW.expense_id AND owner_id=NEW.owner_id AND cancelled=0)) OR
 (NEW.kind='Reembolso' AND NOT EXISTS (SELECT 1 FROM cash_entries WHERE id=NEW.parent_id AND owner_id=NEW.owner_id AND kind='Recebimento' AND cancelled=0 AND receivable_id=NEW.receivable_id AND date<=NEW.date)))
BEGIN SELECT RAISE(ABORT, 'CANCEL_PARENT'); END;
--> statement-breakpoint
CREATE TRIGGER cash_receipt_limit BEFORE INSERT ON cash_entries
WHEN NEW.kind='Recebimento' AND NOT EXISTS (SELECT 1 FROM cash_entries WHERE owner_id=NEW.owner_id AND request_key=NEW.request_key) AND NEW.amount_cents + COALESCE((SELECT SUM(CASE WHEN kind='Recebimento' THEN amount_cents WHEN kind='Reembolso' THEN -amount_cents ELSE 0 END) FROM cash_entries WHERE receivable_id=NEW.receivable_id AND owner_id=NEW.owner_id AND cancelled=0),0) > COALESCE((SELECT amount_cents FROM receivables WHERE id=NEW.receivable_id AND owner_id=NEW.owner_id),0)
BEGIN SELECT RAISE(ABORT, 'CASH_LIMIT'); END;
--> statement-breakpoint
CREATE TRIGGER cash_payment_limit BEFORE INSERT ON cash_entries
WHEN NEW.kind='Pagamento' AND NOT EXISTS (SELECT 1 FROM cash_entries WHERE owner_id=NEW.owner_id AND request_key=NEW.request_key) AND NEW.amount_cents + COALESCE((SELECT SUM(amount_cents) FROM cash_entries WHERE expense_id=NEW.expense_id AND owner_id=NEW.owner_id AND kind='Pagamento' AND cancelled=0),0) > COALESCE((SELECT amount_cents FROM expenses WHERE id=NEW.expense_id AND owner_id=NEW.owner_id),0)
BEGIN SELECT RAISE(ABORT, 'CASH_LIMIT'); END;
--> statement-breakpoint
CREATE TRIGGER cash_refund_limit BEFORE INSERT ON cash_entries
WHEN NEW.kind='Reembolso' AND NOT EXISTS (SELECT 1 FROM cash_entries WHERE owner_id=NEW.owner_id AND request_key=NEW.request_key) AND NEW.amount_cents + COALESCE((SELECT SUM(amount_cents) FROM cash_entries WHERE parent_id=NEW.parent_id AND owner_id=NEW.owner_id AND kind='Reembolso' AND cancelled=0),0) > COALESCE((SELECT amount_cents FROM cash_entries WHERE id=NEW.parent_id AND owner_id=NEW.owner_id AND kind='Recebimento' AND cancelled=0),0)
BEGIN SELECT RAISE(ABORT, 'CASH_LIMIT'); END;
--> statement-breakpoint
CREATE TRIGGER cash_initial_date BEFORE INSERT ON cash_entries
WHEN NOT EXISTS (SELECT 1 FROM cash_entries WHERE owner_id=NEW.owner_id AND request_key=NEW.request_key) AND (
 (NEW.kind='Saldo inicial' AND EXISTS (SELECT 1 FROM cash_entries WHERE owner_id=NEW.owner_id AND cancelled=0 AND date<NEW.date)) OR
 (NEW.kind<>'Saldo inicial' AND EXISTS (SELECT 1 FROM cash_entries WHERE owner_id=NEW.owner_id AND kind='Saldo inicial' AND cancelled=0 AND date>NEW.date)))
BEGIN SELECT RAISE(ABORT, 'INITIAL_DATE'); END;
--> statement-breakpoint
CREATE TRIGGER cash_cancel_receipt BEFORE UPDATE OF cancelled ON cash_entries
WHEN OLD.cancelled=0 AND NEW.cancelled=1 AND OLD.kind='Recebimento' AND EXISTS (SELECT 1 FROM cash_entries WHERE parent_id=OLD.id AND owner_id=OLD.owner_id AND cancelled=0)
BEGIN SELECT RAISE(ABORT, 'HAS_REFUND'); END;
--> statement-breakpoint
CREATE TRIGGER cash_cancel_refund BEFORE UPDATE OF cancelled ON cash_entries
WHEN OLD.cancelled=0 AND NEW.cancelled=1 AND OLD.kind='Reembolso' AND (
 NOT EXISTS (SELECT 1 FROM receivables WHERE id=OLD.receivable_id AND owner_id=OLD.owner_id AND cancelled=0) OR
 OLD.amount_cents + COALESCE((SELECT SUM(CASE WHEN kind='Recebimento' THEN amount_cents WHEN kind='Reembolso' THEN -amount_cents ELSE 0 END) FROM cash_entries WHERE receivable_id=OLD.receivable_id AND owner_id=OLD.owner_id AND cancelled=0),0) > (SELECT amount_cents FROM receivables WHERE id=OLD.receivable_id AND owner_id=OLD.owner_id))
BEGIN SELECT RAISE(ABORT, 'CANCEL_PARENT'); END;
--> statement-breakpoint
CREATE TRIGGER receivable_cancel_guard BEFORE UPDATE OF cancelled ON receivables
WHEN OLD.cancelled=0 AND NEW.cancelled=1 AND COALESCE((SELECT SUM(CASE WHEN kind='Recebimento' THEN amount_cents WHEN kind='Reembolso' THEN -amount_cents ELSE 0 END) FROM cash_entries WHERE receivable_id=OLD.id AND owner_id=OLD.owner_id AND cancelled=0),0)>0
BEGIN SELECT RAISE(ABORT, 'HAS_SETTLEMENT'); END;
--> statement-breakpoint
CREATE TRIGGER expense_cancel_guard BEFORE UPDATE OF cancelled ON expenses
WHEN OLD.cancelled=0 AND NEW.cancelled=1 AND EXISTS (SELECT 1 FROM cash_entries WHERE expense_id=OLD.id AND owner_id=OLD.owner_id AND cancelled=0)
BEGIN SELECT RAISE(ABORT, 'HAS_SETTLEMENT'); END;
