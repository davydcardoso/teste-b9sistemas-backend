import { Either, left, right } from 'src/core/Logic/Either';
import { ProductNameInvalidError } from './errors/product-name-invalid.error';

export class Name {
  private readonly name: string;

  get value() {
    return this.name;
  }

  private constructor(value: string) {
    this.name = value;
  }

  static validate(value: string): boolean {
    if (!value || value.trim().length <= 0 || value.trim().length > 255) {
      return false;
    }

    return true;
  }

  static create(value: string): Either<ProductNameInvalidError, Name> {
    if (!this.validate(value)) {
      return left(new ProductNameInvalidError());
    }

    return right(new Name(value));
  }
}
