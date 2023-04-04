import { NoopException } from "./NoopException";

const DEFAULT_MESSAGE = "Multiple exceptions occurred";

export class MultipleException extends Error {
  public readonly child: Error[];

  constructor(message = DEFAULT_MESSAGE, ...errors: Error[]) {
    super(
      `${message}\n${errors
        .map((error, i) => `#${i}\n\t${error.message.split("\n").join("\n\t")}`)
        .join("\n")}`,
    );
    this.name = "MultipleException";
    this.child = errors;
    Object.setPrototypeOf(this, MultipleException.prototype);
  }

  public remove(error: Error): MultipleException | NoopException {
    const nextErrors = this.child.filter((e) => e !== error);
    if (nextErrors.length)
      return new MultipleException(DEFAULT_MESSAGE, ...nextErrors);
    return new NoopException("All exceptions were handled successfully");
  }
}
