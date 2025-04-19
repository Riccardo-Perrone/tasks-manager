-- Abilita estensione per UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop tabelle esistenti
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS tasks_list;

-- Crea tabella tasks_list
CREATE TABLE tasks_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL UNIQUE,
  order_list INTEGER NOT NULL
);

-- Inserisce valori di default per le task list
INSERT INTO tasks_list (status, order_list) VALUES
  ('to-do', 0),
  ('in-progress', 1),
  ('done', 2);

-- Crea tabella tasks con relazione a tasks_list
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  time_estimated INTEGER NOT NULL,
  order_task INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  task_list_id UUID REFERENCES tasks_list(id) ON DELETE CASCADE
);


-- Qui potrai aggiungere anche altre tabelle:
-- DROP TABLE IF EXISTS users;
-- CREATE TABLE users (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   username TEXT NOT NULL,
--   ...
-- );
