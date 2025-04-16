import { CheckAccessPayload } from "../interfaces/Encryptor-types";

export abstract class FilerManagerPort {
  abstract encrypt(): void;
  abstract checkStorageAccess(payload: CheckAccessPayload): boolean;
}
