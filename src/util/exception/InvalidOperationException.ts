export class InvalidOperationException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "InvalidOperationException";
    Object.setPrototypeOf(this, InvalidOperationException.prototype);
  }
}
