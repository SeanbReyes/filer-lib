import Database from "better-sqlite3";
import { Tables } from "../constants/db.tables";
import { FolderType } from "../interfaces/Folder.types";

const db = new Database("access.db");
db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS ${Tables.Certification} (
    id TEXT PRIMARY KEY,
    certificate_path TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS ${Tables.Folder} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT CHECK(type in ('${FolderType.PRIVATE}', '${FolderType.PUBLIC}')) NOT NULL,
    path TEXT NOT NULL,
    password TEXT,
    max_file_size NUMERIC,
    allowed_types TEXT,
    default_quota INTEGER
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS ${Tables.FolderMetadata} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Auto-incrementing id
    folder_id INTEGER,  -- Foreign key pointing to Folder table
    isDirectory BOOLEAN NOT NULL,
    isFile BOOLEAN NOT NULL,
    size INTEGER NOT NULL,
    createdAt TEXT NOT NULL,  -- Storing as ISO 8601 string
    modifiedAt TEXT NOT NULL, -- Storing as ISO 8601 string
    path TEXT NOT NULL,
    FOREIGN KEY (folder_id) REFERENCES ${Tables.Folder}(id) ON DELETE CASCADE
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS ${Tables.Storage} (
    path TEXT NOT NULL UNIQUE,
    max_size_bytes INTEGER
  )
`);

export default db;
