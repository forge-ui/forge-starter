-- Additive migration. Run only against an explicitly selected database.
BEGIN;
ALTER TABLE semantic_operations ADD COLUMN IF NOT EXISTS harness_run_id text;
ALTER TABLE semantic_operations ADD COLUMN IF NOT EXISTS harness_request_id text;
CREATE TABLE IF NOT EXISTS harness_runs (
  id text PRIMARY KEY,
  owner_id text NOT NULL,
  application_id text NOT NULL,
  build_id text NOT NULL,
  revision integer NOT NULL,
  state jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS harness_runs_owner_application_updated_idx
  ON harness_runs (owner_id, application_id, updated_at);
COMMIT;
