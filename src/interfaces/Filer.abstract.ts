import { Filer } from "../concepts/Filer";

export abstract class FilerManagerPort {
  abstract initialize(Filer: Filer): Promise<void>;
  abstract encrypt(): Promise<void>;
}
