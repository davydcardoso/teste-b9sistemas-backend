export interface CreateProductRequestDTO {
  name: string;
  price: number;
  stock: number;
}

export interface DeleteProductRequestHeaderDTO {
  product_id: string;
}

export interface EditProductRequestDTO {
  name: string;
  price: number;
  stock: number;
}

export interface EditProductRequestHeaderDTO {
  product_id: string;
}
