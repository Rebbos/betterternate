-- Review workflow for the future volunteer screen: every submission starts as 'new'.
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'in_progress', 'done', 'spam')),
  ADD COLUMN IF NOT EXISTS handled_at timestamptz,
  ADD COLUMN IF NOT EXISTS handled_by text,  -- volunteer who handled it (audit trail)
  ADD COLUMN IF NOT EXISTS note text;        -- internal note, never shown publicly

CREATE INDEX IF NOT EXISTS idx_submissions_status_created ON submissions (status, created_at);
