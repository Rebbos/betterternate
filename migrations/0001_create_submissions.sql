-- Contact messages and page feedback from the public forms (functions/api).
CREATE TABLE submissions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  type       TEXT    NOT NULL CHECK (type IN ('contact', 'feedback')),
  category   TEXT    NOT NULL,
  message    TEXT    NOT NULL DEFAULT '',
  name       TEXT,             -- null when anonymous or not given
  email      TEXT,             -- null when anonymous
  page_url   TEXT,
  created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX idx_submissions_type_created ON submissions (type, created_at);
