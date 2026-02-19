import { BaseDto } from "../base-dto";
import { ProductDto } from "../product/product-dto";
import { SupplierDto } from "../supplier/supplier-dto";
import { UserDto } from "../users/user-dto";
import { StockMovementType } from "./stock-movement-type";

export class StockMovementDto extends BaseDto {
    productId: number = 0;
    product: ProductDto | null = null;

    type: StockMovementType = StockMovementType.In;
    quantity: number = 0;
    occurredAt: string = "";

    reason: string | null = null;
    documentNo: string | null = null;

    supplierId: number | null = null;
    supplier: SupplierDto | null = null;

    userId: string | null = null;
    user: UserDto | null = null;
}
