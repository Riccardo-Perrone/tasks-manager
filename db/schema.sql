-- Abilita estensione per UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop tabelle esistenti
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS tasks_list;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS projects;

-- Crea tabella tasks_list
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Crea tabella tasks_list
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crea tabella tasks_list
CREATE TABLE tasks_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL,
  order_list INTEGER NOT NULL,
  projects_id UUID REFERENCES projects(id) ON DELETE CASCADE
);

-- Crea tabella tasks con relazione a tasks_list
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  time_estimated INTEGER,
  order_task INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  task_list_id UUID REFERENCES tasks_list(id) ON DELETE CASCADE
);

-- Crea tabella comments con relazioni a tasks e users
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE
);
