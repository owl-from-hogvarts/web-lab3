
CREATE TABLE IF NOT EXISTS area_results (
  x double precision NOT NULL,
  y double precision NOT NULL,
  scale double precision NOT NULL,
  result boolean NOT NULL,
  executedAt time NOT NULL,
  executionDuration bigint NOT NULL
);
