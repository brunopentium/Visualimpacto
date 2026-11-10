DROP INDEX `receivable_owner_contract`;--> statement-breakpoint
CREATE UNIQUE INDEX `receivable_owner_contract` ON `receivables` (`owner_id`,`contract_id`) WHERE "receivables"."cancelled"=0;--> statement-breakpoint
CREATE UNIQUE INDEX `single_opening_balance` ON `cash_entries` (`owner_id`) WHERE "cash_entries"."kind"='Saldo inicial' AND "cash_entries"."cancelled"=0;