export class ProductNameInvalidError extends Error {
  constructor() {
    super('O Nome do produto informado está invalido');

    this.name = 'ProductNameInvalidError';
  }
}
