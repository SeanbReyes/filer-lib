class FileSystemError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class FileNotFoundError extends FileSystemError {
  constructor(path: string) {
    super(`File or folder not found: ${path}`, "ENOENT");
  }
}

export class PermissionDeniedError extends FileSystemError {
  constructor(path: string) {
    super(`Permission denied: ${path}`, "EACCES");
  }
}

export class FileAlreadyExistsError extends FileSystemError {
  constructor(path: string) {
    super(`File or folder already exists: ${path}`, "EEXIST");
  }
}

export class NotDirectoryError extends FileSystemError {
  constructor(path: string) {
    super(`Not a directory: ${path}`, "ENOTDIR");
  }
}

export class IsDirectoryError extends FileSystemError {
  constructor(path: string) {
    super(`Is a directory: ${path}`, "EISDIR");
  }
}

export class TooManySymlinksError extends FileSystemError {
  constructor(path: string) {
    super(`Too many symbolic links encountered: ${path}`, "ELOOP");
  }
}

export class NoSpaceLeftError extends FileSystemError {
  constructor(path: string) {
    super(`No space left on device: ${path}`, "ENOSPC");
  }
}

export class UnknownFileSystemError extends FileSystemError {
  constructor(path: string, code: string) {
    super(`Unknown filesystem error at: ${path} (code: ${code})`, code);
  }
}

export class FileSystemErrorManager {
  public static handle(e: any, path: string): FileSystemError {
    switch (e.code) {
      case "ENOENT":
        return new FileNotFoundError(path);
      case "EACCES":
        return new PermissionDeniedError(path);
      case "EEXIST":
        return new FileAlreadyExistsError(path);
      case "ENOTDIR":
        return new NotDirectoryError(path);
      case "EISDIR":
        return new IsDirectoryError(path);
      case "ELOOP":
        return new TooManySymlinksError(path);
      case "ENOSPC":
        return new NoSpaceLeftError(path);
      default:
        return new UnknownFileSystemError(path, e.code);
    }
  }
}
