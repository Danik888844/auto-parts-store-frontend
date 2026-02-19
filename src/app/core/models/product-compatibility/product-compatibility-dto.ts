import { BaseDto } from "../base-dto";
import { ProductDto } from "../product/product-dto";
import { VehicleDto } from "../vehicle/vehicle-dto";

export class ProductCompatibilityDto extends BaseDto {
    productId: string = "";
    product: ProductDto | null = null;

    vehicleId: string = "";
    vehicle: VehicleDto | null = null;

    comment: string | null = null;
}
