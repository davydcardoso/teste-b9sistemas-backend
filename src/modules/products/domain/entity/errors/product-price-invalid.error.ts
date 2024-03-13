export class ProductPriceInvalidError extends Error {
  constructor() {
    super('O Preço do produto informado é invalido');

    this.name = 'ProductPriceInvalidError';
  }
}
