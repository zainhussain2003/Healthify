-- V2: Fix slider_intensity column type from SMALLINT to INTEGER
-- Required because Hibernate maps Java int to INTEGER, not SMALLINT

ALTER TABLE saved_recipes
    ALTER COLUMN slider_intensity TYPE INTEGER;
