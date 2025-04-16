export abstract class FilerManagerPort {
  abstract initialize(): Promise<void>;
  abstract encrypt(): Promise<void>;
}
