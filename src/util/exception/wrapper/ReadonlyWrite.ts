import { ReadonlyWriteException } from "../ReadonlyWriteException";

export function ReadonlyWrite(message = "Cannot write on readonly"): never {
  throw new ReadonlyWriteException(message);
}
