export interface CreateProductRequestDTO {
  name: string;
  price: number;
  stock: number;
}

export interface DeleteProductRequestHeaderDTO {
  product_id: string;
}
