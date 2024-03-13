import { Either, left, right } from 'src/core/Logic/Either';
import { ProductStockInvalidError } from './errors/product-stock-invalid.error';

export class Stock {
  private readonly stock: number;

  get value() {
    return this.stock;
  }

  private constructor(value: number) {
    this.stock = value;
  }

  static validate(value: number): boolean {
    if (!value || value < 0 || value > 9999999) {
      return false;
    }

    return true;
  }

  static create(value: number): Either<ProductStockInvalidError, Stock> {
    if (!this.validate(value)) {
      return left(new ProductStockInvalidError());
    }

    return right(new Stock(value));
  }
}
