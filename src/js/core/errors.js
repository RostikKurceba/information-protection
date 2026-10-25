
export class CipherError extends Error {
  constructor(message) {
    super(message);
    this.name = "CipherError";
  }
}
