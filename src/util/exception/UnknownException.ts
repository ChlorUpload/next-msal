export class UnknownException extends Error {
  constructor(err: any) {
    super("Unknown error: " + JSON.stringify(err));
    this.name = "UnknownException";
    Object.setPrototypeOf(this, UnknownException.prototype);
  }
}
