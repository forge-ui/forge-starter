-- Additive upgrade for persistent local sessions. Existing JWTs require login again.
BEGIN;
CREATE TABLE IF NOT EXISTS auth_sessions (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  credential_version text NOT NULL,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS auth_sessions_user_idx ON auth_sessions(user_id);
-- Preserve existing user roles; only future implicit inserts receive readonly.
ALTER TABLE users ALTER COLUMN role_code SET DEFAULT 'readonly';
COMMIT;
