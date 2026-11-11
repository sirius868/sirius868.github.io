UPDATE daily_visitors
SET first_seen = replace(substr(first_seen, 1, 19), 'T', ' ')
WHERE length(first_seen) = 25 AND substr(first_seen, 20) = '+08:00';
