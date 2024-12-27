export class InvalidProductError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ParseProductError extends Error {
  constructor(message: string) {
    super(message);
  }
}
