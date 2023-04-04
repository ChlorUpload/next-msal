import type { MultipleException } from "./MultipleException";
import { never } from "./never";

const DEFAULT_MESSAGE = "Must not be thrown";

export class NoopException extends Error {
  constructor(message = DEFAULT_MESSAGE) {
    super(message);
    this.name = "NoopException";
    Object.setPrototypeOf(this, NoopException.prototype);
  }
  public remove(_error: Error): MultipleException | NoopException {
    throw never();
  }
}
