import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  CreateProductRequestDTO,
  DeleteProductRequestHeaderDTO,
} from '../../dtos/product-controller.dto';
import { CreateNewProductUseCase } from '../../use-cases/create-new-product-usecase';
import { GetAllProductsUseCase } from '../../use-cases/get-all-products-usecase';
import { DeleteProductUseCase } from '../../use-cases/delete-product-usecase';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly createNewProductUseCase: CreateNewProductUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  async create(
    @Res() response: Response,
    @Body() body: CreateProductRequestDTO,
  ) {
    try {
      const { name, price, stock } = body;

      const result = await this.createNewProductUseCase.perform({
        name,
        price,
        stock,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }

      response.status(HttpStatus.CREATED).send({ ...result.value });
      return;
    } catch (err: any) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getAllProducts(@Res() response: Response) {
    try {
      const result = await this.getAllProductsUseCase.perform();

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }

      response.status(HttpStatus.CREATED).send({ ...result.value });
      return;
    } catch (err: any) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete()
  async deleteProduct(
    @Res() response: Response,
    @Body() body: any,
    @Headers() header: DeleteProductRequestHeaderDTO,
  ) {
    try {
      const { product_id } = header;

      const result = await this.deleteProductUseCase.perform({
        id: product_id,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }

      response.status(HttpStatus.OK).send({ ...result.value });
      return;
    } catch (err: any) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
