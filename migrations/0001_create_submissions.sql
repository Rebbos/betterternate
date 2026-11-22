-- Contact messages and page feedback from the public forms (api/contact.ts, api/feedback.ts).
CREATE TABLE IF NOT EXISTS submissions (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type       text        NOT NULL CHECK (type IN ('contact', 'feedback')),
  category   text        NOT NULL,
  message    text        NOT NULL DEFAULT '',
  name       text,       -- null when anonymous or not given
  email      text,       -- null when anonymous
  page_url   text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_type_created ON submissions (type, created_at);
