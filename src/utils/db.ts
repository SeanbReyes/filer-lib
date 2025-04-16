import Database from "better-sqlite3";
import { CertificateTableName, Tables } from "../constants/db.tables";
import { FolderType } from "../interfaces/Folder.types";

const db = new Database("access.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS ${CertificateTableName} (
    id TEXT PRIMARY KEY,
    certificate_path TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS ${Tables.Folder} (
    id TEXT PRIMARY KEY,
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
  CREATE TABLE IF NOT EXISTS ${Tables.Storage} (
    path TEXT NOT NULL,
    max_size_bytes INTEGER
  )
`);

export default db;
