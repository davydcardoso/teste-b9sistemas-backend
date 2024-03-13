export class ProductNotExistsInSystemError extends Error {
  constructor() {
    super('O produto informado não existe em nosso sitema');

    this.name = 'ProductNotExistsInSystemError';
  }
}
