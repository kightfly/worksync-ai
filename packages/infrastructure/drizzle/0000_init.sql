-- Initial schema for GienHarness replay
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  "name" text NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "tasks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id"),
  "title" text NOT NULL,
  "description" text,
  "status" text DEFAULT 'todo' NOT NULL,
  "due_date" date,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "tasks_user_id_idx" ON "tasks" ("user_id");
CREATE INDEX IF NOT EXISTS "tasks_user_status_idx" ON "tasks" ("user_id","status");
CREATE INDEX IF NOT EXISTS "tasks_user_created_idx" ON "tasks" ("user_id","created_at");

CREATE TABLE IF NOT EXISTS "attendance_records" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id"),
  "check_in_time" timestamptz NOT NULL,
  "check_out_time" timestamptz,
  "work_date" date NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "attendance_user_work_date_idx" ON "attendance_records" ("user_id","work_date");
CREATE INDEX IF NOT EXISTS "attendance_user_check_in_idx" ON "attendance_records" ("user_id","check_in_time");
