import { InvalidOperationException } from "./InvalidOperationException";

export class ReadonlyWriteException extends InvalidOperationException {
  constructor(message?: string) {
    super(message);
    this.name = "ReadonlyWriteException";
    Object.setPrototypeOf(this, ReadonlyWriteException.prototype);
  }
}
