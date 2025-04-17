export abstract class FilerWriterOsAdapter {
  abstract checkAccess(): void;
  abstract initialize_storage(path: string): void;
}
