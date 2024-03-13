import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateProductRequestDTO } from '../../dtos/product-controller.dto';
import { CreateNewProductUseCase } from '../../use-cases/create-new-product-usecase';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly createNewProductUseCase: CreateNewProductUseCase,
  ) {}

  @Post()
  async create(
    @Res() response: Response,
    @Body() body: CreateProductRequestDTO,
  ) {
    try {
      const { name, price, stock } = body;
    } catch (err: any) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
