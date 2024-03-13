import { Either, left, right } from 'src/core/Logic/Either';
import { ProductPriceInvalidError } from './errors/product-price-invalid.error';

export class Price {
  private readonly price: number;

  get value() {
    return this.price;
  }

  private constructor(value: number) {
    this.price = value;
  }

  static validate(value: number): boolean {
    if (!value || value <= 0 || value > 999999) {
      return false;
    }

    return true;
  }

  static create(value: number): Either<ProductPriceInvalidError, Price> {
    if (!this.validate(value)) {
      return left(new ProductPriceInvalidError());
    }

    return right(new Price(value));
  }
}
