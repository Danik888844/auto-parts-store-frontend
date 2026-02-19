import { BaseDto } from "../base-dto";
import { ProductDto } from "../product/product-dto";
import { SaleDto } from "./sale-dto";

export class SaleItemDto extends BaseDto {
    saleId: number = 0;
    sale: SaleDto | null = null;
    productId: number = 0;
    product: ProductDto | null = null;
    quantity: number = 0;
    price: number = 0;
    lineTotal: number = 0;
}

export class SaleItemFormDto
{
    productId: number = 0;
    quantity: number = 0;
}