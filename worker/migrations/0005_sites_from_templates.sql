-- A site made straight from the template gallery has no generation behind it,
-- so the two columns that named one become nullable. SQLite cannot change a
-- column's constraint in place and D1 does not let a migration switch foreign
-- keys off, so both tables are rebuilt, and in child-first order on purpose:
-- dropping a parent table under enforced foreign keys runs an implicit DELETE
-- that would cascade into `revision` and take every saved document with it.
-- The rebuilt child references the rebuilt parent by its temporary name; the
-- rename at the end rewrites that reference (SQLite 3.26+, which D1 is).
CREATE TABLE `__new_site` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`generation_id` text,
	`direction_index` integer,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`spec_version` integer NOT NULL,
	`template_hash` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`generation_id`) REFERENCES `generation`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_site`("id", "user_id", "generation_id", "direction_index", "slug", "title", "spec_version", "template_hash", "created_at", "updated_at") SELECT "id", "user_id", "generation_id", "direction_index", "slug", "title", "spec_version", "template_hash", "created_at", "updated_at" FROM `site`;--> statement-breakpoint
CREATE TABLE `__new_revision` (
	`id` text PRIMARY KEY NOT NULL,
	`site_id` text NOT NULL,
	`n` integer NOT NULL,
	`edits` text NOT NULL,
	`instruction` text,
	`source` text NOT NULL,
	`model` text NOT NULL,
	`response_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`site_id`) REFERENCES `__new_site`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_revision`("id", "site_id", "n", "edits", "instruction", "source", "model", "response_id", "created_at") SELECT "id", "site_id", "n", "edits", "instruction", "source", "model", "response_id", "created_at" FROM `revision`;--> statement-breakpoint
DROP TABLE `revision`;--> statement-breakpoint
DROP TABLE `site`;--> statement-breakpoint
ALTER TABLE `__new_site` RENAME TO `site`;--> statement-breakpoint
ALTER TABLE `__new_revision` RENAME TO `revision`;--> statement-breakpoint
CREATE INDEX `site_user_updated_idx` ON `site` (`user_id`,`updated_at`);--> statement-breakpoint
CREATE INDEX `site_generation_idx` ON `site` (`generation_id`);--> statement-breakpoint
CREATE INDEX `revision_site_n_idx` ON `revision` (`site_id`,`n`);
