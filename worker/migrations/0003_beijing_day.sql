ALTER TABLE daily_visitors RENAME TO daily_visitors_utc_archive;
ALTER TABLE daily_pageviews RENAME TO daily_pageviews_utc_archive;

CREATE TABLE daily_visitors (
  day TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  first_seen TEXT NOT NULL,
  location_zh TEXT,
  ip_address TEXT,
  PRIMARY KEY (day, visitor_hash)
);

CREATE TABLE daily_pageviews (
  day TEXT NOT NULL,
  pathname TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, pathname)
);
