export enum FileType {
  PDF = "pdf",
  DOC = "doc",
  DOCX = "docx",
  TXT = "txt",
  RTF = "rtf",
  XLS = "xls",
  XLSX = "xlsx",
  PPT = "ppt",
  PPTX = "pptx",
  CSV = "csv",
  JPG = "jpg",
  JPEG = "jpeg",
  PNG = "png",
  GIF = "gif",
  SVG = "svg",
  WEBP = "webp",
  BMP = "bmp",
  TIFF = "tiff",
  MP3 = "mp3",
  WAV = "wav",
  AAC = "aac",
  OGG = "ogg",
  FLAC = "flac",
  MP4 = "mp4",
  MOV = "mov",
  AVI = "avi",
  WMV = "wmv",
  MKV = "mkv",
  FLV = "flv",
  ZIP = "zip",
  RAR = "rar",
  TAR = "tar",
  GZ = "gz",
  "7Z" = "7z",
  JS = "js",
  TS = "ts",
  HTML = "html",
  CSS = "css",
  JSON = "json",
  XML = "xml",
  EXE = "exe",
  MSI = "msi",
  DMG = "dmg",
  APP = "app",
  ICO = "ico",
  TTF = "ttf",
  WOFF = "woff",
  WOFF2 = "woff2",
  EOT = "eot",
  SQL = "sql",
  LOG = "log",
  INI = "ini",
  CONF = "conf",
  YML = "yml",
  YAML = "yaml",
  ANY = "any",
}

export enum FolderType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export interface FolderConfig {
  name: string;
  default_quota?: number;
  allowed_types?: FileType;
  max_file_size?: number;
  password?: string | null;
  type: FolderType;
  path: string;
}

export interface FolderConfigPayload {
  name: string;
  default_quota?: number;
  allowed_types?: FileType;
  max_file_size?: number;
  password?: string | null;
  type: FolderType;
}

export interface FolderPayload {
  config: FolderConfigPayload;
}

export interface GetFolderDataResponse {
  path: string;
  id: number;
  metadata?: FolderStatResponse | null;
}

export interface FolderStatResponse {
  isDirectory: boolean;
  isFile: boolean;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  path: string;
}
