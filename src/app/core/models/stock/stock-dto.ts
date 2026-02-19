import { ProductDto } from "../product/product-dto";

export class StockDto {
    productId: number = 0;
    product: ProductDto | null = null;

    quantity: number = 0;
}
