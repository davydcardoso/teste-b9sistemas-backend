export class ProductStockInvalidError extends Error {
  constructor() {
    super('A quantidade de estoque informado é invalido.');

    this.name = 'ProductStockInvalidError';
  }
}
