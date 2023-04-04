import { InvalidOperationException } from "./InvalidOperationException";

export class UseAfterDisposeException extends InvalidOperationException {
  constructor(message?: string) {
    super(message);
    this.name = "UseAfterDisposeException";
    Object.setPrototypeOf(this, UseAfterDisposeException.prototype);
  }
}
