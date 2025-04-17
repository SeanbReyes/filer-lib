import { Folder } from "./Folder";
import { FileType, FolderPayload } from "../interfaces/Folder.types";
import { FilerPayload } from "../interfaces/Filer.types";
import { FilerService } from "../services/Filer.service";

export class Filer {
  declare private path: string;
  declare private folders: Folder[];
  declare private max_size_bytes: number;
  private readonly service: FilerService;
  constructor(payload: FilerPayload) {
    this.service = new FilerService();
    this.init(payload);
  }
  get _path(): typeof this.path {
    return this.path;
  }
  protected init(payload: FilerPayload): void {
    this.service.checkAccess();
    const path = this.service.sanitizePath(
      this.service.getPlatformSecurePath(payload.name),
    );
    const max_size_bytes = payload.max_size_bytes || Infinity;
    this.initialize_root(path, max_size_bytes);
    this.initializeFolders();
  }
  private initialize_root(path: string, max_size_bytes?: number | null): void {
    this.service.initialize_root(path, max_size_bytes);
  }
  private initializeFolders(): void {
    const rows = this.service.getAllFolders();
    if (rows.length == 0) {
      this.folders = [];
      return;
    }
    for (let x = 0; x < rows.length; x++) {
      const folder = new Folder({
        config: {
          name: rows[x].name,
          type: rows[x].type,
          allowed_types: rows[x].allowed_types as FileType,
          default_quota: rows[x].default_quota || undefined,
          max_file_size: rows[x].max_file_size || undefined,
          password: rows[x].password,
        },
      });
      this.folders.push(folder);
    }
  }
  protected createFolder(payload: FolderPayload): void {}
}
