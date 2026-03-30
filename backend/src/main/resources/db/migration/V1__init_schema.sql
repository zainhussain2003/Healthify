-- V1: Initial schema

CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE recipes (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    original_text   TEXT NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE saved_recipes (
    id                      BIGSERIAL PRIMARY KEY,
    user_id                 BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id               BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    substituted_ingredients JSONB,
    rewritten_instructions  TEXT,
    slider_intensity        INTEGER NOT NULL CHECK (slider_intensity BETWEEN 1 AND 5),
    mode                    VARCHAR(10) NOT NULL CHECK (mode IN ('COOKING', 'BAKING')),
    created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, recipe_id)
);

CREATE TABLE baking_substitutions (
    id              BIGSERIAL PRIMARY KEY,
    original        VARCHAR(255) NOT NULL,
    substitute      VARCHAR(255) NOT NULL,
    ratio           NUMERIC(5,3) NOT NULL,
    notes           TEXT,
    category        VARCHAR(50) NOT NULL  -- FAT, SUGAR, EGG, FLOUR, DAIRY
);

-- Indexes
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_saved_recipes_user_id ON saved_recipes(user_id);
