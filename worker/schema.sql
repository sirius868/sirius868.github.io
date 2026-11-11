CREATE TABLE IF NOT EXISTS daily_visitors (
  day TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  first_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  location_zh TEXT,
  ip_address TEXT,
  PRIMARY KEY (day, visitor_hash)
);

CREATE TABLE IF NOT EXISTS daily_pageviews (
  day TEXT NOT NULL,
  pathname TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, pathname)
);
