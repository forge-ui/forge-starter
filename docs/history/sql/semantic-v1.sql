-- Apply only to an explicitly selected database. Additive migration, compatible with old readers.
BEGIN;
ALTER TABLE admin_accounts ADD COLUMN IF NOT EXISTS revision integer NOT NULL DEFAULT 1;
CREATE TABLE IF NOT EXISTS semantic_operations (
 id uuid PRIMARY KEY, user_id text NOT NULL, action_id text NOT NULL,
 entity_id text, contract_version text NOT NULL, state text NOT NULL,
 fingerprint text, receipt jsonb, expires_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
COMMIT;
